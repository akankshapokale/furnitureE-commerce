import 'dotenv/config';
import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const backendRoot = process.cwd();
const projectRoot = path.resolve(backendRoot, '..');
const dashboardRoot = path.join(projectRoot, 'Dashboard', 'furniture-dashboard', 'public');
const websiteRoot = path.join(projectRoot, 'website', 'public');
const reportPath = path.join(backendRoot, 'cloudinary-migration-report.json');
const supported = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);

for (const [name, value] of Object.entries({
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
})) {
  if (!value || value === 'Root' || value.startsWith('your-')) throw new Error(`${name} is missing or invalid in Backend/.env`);
}
for (const source of [dashboardRoot, websiteRoot]) {
  if (!existsSync(source)) throw new Error(`Expected image directory not found: ${source}`);
}
await cloudinary.api.ping();

async function listImages(directory) {
  const result = [];
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const filename = path.join(folder, entry.name);
      if (entry.isDirectory()) await walk(filename);
      else if (entry.isFile() && supported.has(path.extname(entry.name).toLowerCase())) result.push(filename);
    }
  }
  await walk(directory);
  return result.sort((a, b) => a.localeCompare(b));
}

async function sha256(filename) {
  const hash = createHash('sha256');
  await new Promise((resolve, reject) => createReadStream(filename).on('data', chunk => hash.update(chunk)).on('end', resolve).on('error', reject));
  return hash.digest('hex');
}

const report = existsSync(reportPath)
  ? JSON.parse(await readFile(reportPath, 'utf8'))
  : { created_at: new Date().toISOString(), files: [] };
const entries = new Map(report.files.map(item => [`${item.source_root}:${item.relative_path}`, item]));
const assetsByHash = new Map(report.files.filter(item => item.status === 'uploaded' && item.sha256 && item.public_id).map(item => [item.sha256, item]));
const sources = [
  { name: 'dashboard-public', directory: dashboardRoot, urlPrefix: '' },
  { name: 'website-public', directory: websiteRoot, urlPrefix: '' },
];
const allFiles = [];
for (const source of sources) {
  for (const filename of await listImages(source.directory)) {
    allFiles.push({ source, filename, relative: path.relative(source.directory, filename).split(path.sep).join('/') });
  }
}
console.log(`Found ${allFiles.length} image files. Existing files and database records will not be modified.`);
let uploaded = 0, deduplicated = 0, skipped = 0, failed = 0, completed = 0, nextIndex = 0;
const concurrency = 6;
const inFlightByHash = new Map();
let writeChain = Promise.resolve();
let pendingCheckpoint = 0;
const saveReport = () => {
  report.files = [...entries.values()];
  report.updated_at = new Date().toISOString();
  report.summary = { scanned: allFiles.length, newly_uploaded: uploaded, deduplicated, already_migrated: skipped, failed };
  const snapshot = JSON.stringify(report, null, 2);
  writeChain = writeChain.then(async () => {
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, snapshot);
  });
  return writeChain;
};

async function processFile(index) {
  const { source, filename, relative } = allFiles[index];
  const key = `${source.name}:${relative}`;
  const old = entries.get(key);
  if (old?.status === 'uploaded' && old.public_id && old.cloudinary_url) { skipped++; return; }
  const oldUrl = `${source.urlPrefix}/${relative}`.replace(/\\+/g, '/');
  try {
    const digest = await sha256(filename);
    let asset = assetsByHash.get(digest);
    let wasDeduplicated = Boolean(asset);
    if (!asset) {
      const pending = inFlightByHash.get(digest);
      if (pending) {
        asset = await pending;
        wasDeduplicated = true;
        deduplicated++;
      } else {
        const folderPath = path.posix.dirname(relative);
        const folder = ['furniture-migration', source.name, folderPath === '.' ? '' : folderPath].filter(Boolean).join('/');
        const publicId = `sha256-${digest}`;
        const pendingUpload = (async () => {
          try {
            const result = await cloudinary.uploader.upload(filename, {
              resource_type: 'image', folder, public_id: publicId,
              use_filename: false, unique_filename: false, overwrite: false,
            });
            return { cloudinary_url: result.secure_url, public_id: result.public_id, format: result.format, bytes: result.bytes, width: result.width, height: result.height };
          } catch (uploadError) {
            // A prior interrupted run may have uploaded the deterministic ID before saving its report.
            const existing = await cloudinary.api.resource(`${folder}/${publicId}`, { resource_type: 'image' }).catch(() => null);
            if (!existing?.secure_url || !existing.public_id) throw uploadError;
            return { cloudinary_url: existing.secure_url, public_id: existing.public_id, format: existing.format, bytes: existing.bytes, width: existing.width, height: existing.height };
          }
        })();
        inFlightByHash.set(digest, pendingUpload);
        try {
          asset = await pendingUpload;
          assetsByHash.set(digest, asset);
          uploaded++;
        } finally {
          inFlightByHash.delete(digest);
        }
      }
    } else {
      deduplicated++;
    }
    entries.set(key, {
      source_root: source.name, relative_path: relative, old_url: oldUrl,
      cloudinary_url: asset.cloudinary_url, public_id: asset.public_id,
      sha256: digest, status: 'uploaded', deduplicated: wasDeduplicated,
      ...(asset.format ? { format: asset.format } : {}),
      ...(asset.bytes ? { bytes: asset.bytes } : {}),
      ...(asset.width ? { width: asset.width } : {}),
      ...(asset.height ? { height: asset.height } : {}),
      uploaded_at: new Date().toISOString(),
    });
  } catch (error) {
    entries.set(key, {
      source_root: source.name, relative_path: relative, old_url: oldUrl,
      sha256: await sha256(filename).catch(() => null), status: 'failed',
      error: String(error?.message || error), attempted_at: new Date().toISOString(),
    });
    failed++;
  }
}

async function worker() {
  while (true) {
    const index = nextIndex++;
    if (index >= allFiles.length) return;
    await processFile(index);
    completed++;
    pendingCheckpoint++;
    if (pendingCheckpoint >= 15 || completed === allFiles.length) {
      pendingCheckpoint = 0;
      await saveReport();
    }
    if (completed % 25 === 0 || completed === allFiles.length) {
      console.log(`${completed}/${allFiles.length} scanned; ${uploaded} uploaded, ${deduplicated} duplicate-content mappings, ${skipped} already migrated, ${failed} failed`);
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));
await saveReport();
console.log(`Migration complete: ${JSON.stringify(report.summary)}`);
