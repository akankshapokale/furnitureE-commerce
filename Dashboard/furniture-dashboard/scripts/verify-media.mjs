import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const manifestPath = path.resolve(process.env.MEDIA_MANIFEST || "media-migration-report.json");
if (!existsSync(manifestPath)) throw new Error(`Migration report not found: ${manifestPath}`);
const report = JSON.parse(await readFile(manifestPath, "utf8"));
let verified = 0, failed = 0, skipped = 0;
for (const item of report.files) {
  if (item.status !== "uploaded" || !item.new_url || !item.public_id) { skipped++; continue; }
  try {
    if (!item.new_url.startsWith("https://res.cloudinary.com/")) throw new Error("URL is not a Cloudinary delivery URL");
    const response = await fetch(item.new_url, { method: "HEAD", redirect: "follow" });
    if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) throw new Error(`HTTP ${response.status}; content-type ${response.headers.get("content-type") || "missing"}`);
    item.verification = { status: "verified", checked_at: new Date().toISOString(), http_status: response.status, content_type: response.headers.get("content-type") };
    verified++;
  } catch (error) {
    item.verification = { status: "failed", checked_at: new Date().toISOString(), error: String(error) };
    failed++;
  }
  await writeFile(manifestPath, JSON.stringify(report, null, 2));
}
report.verification_summary = { verified, failed, skipped, checked_at: new Date().toISOString() };
await writeFile(manifestPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.verification_summary));
if (failed) process.exitCode = 1;
