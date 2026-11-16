import { createHash } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Upload copies through the authenticated companion API, never directly from browser code.
// This script intentionally does not connect to PostgreSQL or change application URLs.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiOrigin = (process.env.MEDIA_API_ORIGIN || process.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const token = process.env.MEDIA_MIGRATION_TOKEN;
const manifestPath = path.resolve(process.env.MEDIA_MANIFEST || path.join(root, "media-migration-report.json"));
const scanDirs = (process.env.MEDIA_SCAN_DIRS || "public").split(path.delimiter).map((dir) => path.resolve(root, dir));
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
if (!token) throw new Error("Set MEDIA_MIGRATION_TOKEN to an authorized backend token before uploading.");

const files = [];
async function walk(directory) {
  if (!existsSync(directory)) return;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (entry.isFile() && allowedExtensions.has(path.extname(entry.name).toLowerCase())) files.push(fullPath);
  }
}
for (const dir of scanDirs) await walk(dir);

const report = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf8")) : { created_at: new Date().toISOString(), files: [] };
const records = new Map(report.files.map((item) => [item.old_url, item]));
let uploaded = 0, skipped = 0, failed = 0;
for (const filePath of files) {
  const relative = path.relative(root, filePath).split(path.sep).join("/");
  const oldUrl = `/${relative}`;
  const previous = records.get(oldUrl);
  if (previous?.status === "uploaded" && previous.public_id && previous.new_url) { skipped++; continue; }
  const digest = createHash("sha256");
  await new Promise((resolve, reject) => createReadStream(filePath).on("data", (chunk) => digest.update(chunk)).on("end", resolve).on("error", reject));
  const hash = digest.digest("hex");
  const form = new FormData();
  form.append("image", new Blob([await readFile(filePath)]), path.basename(filePath));
  form.append("folder", `migration/${path.dirname(relative).replaceAll("\\", "/")}`);
  form.append("source_path", relative);
  form.append("sha256", hash);
  try {
    const response = await fetch(`${apiOrigin}/api/upload/image`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
    const body = await response.json().catch(() => ({}));
    const item = body.data ?? body;
    if (!response.ok || typeof item.url !== "string" || !item.url.startsWith("https://res.cloudinary.com/") || typeof item.public_id !== "string") {
      throw new Error(body.message || `API must return a verified Cloudinary URL and public_id (HTTP ${response.status})`);
    }
    records.set(oldUrl, { old_url: oldUrl, new_url: item.url, public_id: item.public_id, sha256: hash, source_path: relative, status: "uploaded", uploaded_at: new Date().toISOString() });
    uploaded++;
  } catch (error) {
    records.set(oldUrl, { old_url: oldUrl, new_url: null, public_id: null, sha256: hash, source_path: relative, status: "failed", error: String(error) });
    failed++;
  }
  report.files = [...records.values()];
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(report, null, 2));
  console.log(`${uploaded + skipped + failed}/${files.length} ${relative}`);
}
report.updated_at = new Date().toISOString();
report.summary = { scanned: files.length, newly_uploaded: uploaded, skipped, failed };
report.files = [...records.values()];
await mkdir(path.dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary));
