import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const reportPath = path.resolve('cloudinary-migration-report.json');
if (!existsSync(reportPath)) throw new Error(`Migration report not found: ${reportPath}`);
const report = JSON.parse(await readFile(reportPath, 'utf8'));
const uploaded = report.files.filter(item => item.status === 'uploaded' && item.cloudinary_url && item.public_id);
const unique = [...new Map(uploaded.map(item => [item.public_id, item])).values()];
const verification = new Map();
let nextIndex = 0, completed = 0, failed = 0;
const concurrency = 12;
let writeChain = Promise.resolve();
const save = () => {
  const snapshot = JSON.stringify(report, null, 2);
  writeChain = writeChain.then(() => writeFile(reportPath, snapshot));
  return writeChain;
};

async function worker() {
  while (true) {
    const index = nextIndex++;
    if (index >= unique.length) return;
    const item = unique[index];
    let result;
    try {
      if (!item.cloudinary_url.startsWith('https://res.cloudinary.com/')) throw new Error('Not a secure Cloudinary URL');
      const response = await fetch(item.cloudinary_url, { method: 'HEAD', redirect: 'follow' });
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType?.startsWith('image/')) throw new Error(`HTTP ${response.status}; content-type ${contentType || 'missing'}`);
      result = { status: 'verified', checked_at: new Date().toISOString(), http_status: response.status, content_type: contentType };
    } catch (error) {
      result = { status: 'failed', checked_at: new Date().toISOString(), error: String(error?.message || error) };
      failed++;
    }
    verification.set(item.public_id, result);
    completed++;
    if (completed % 25 === 0 || completed === unique.length) {
      for (const record of uploaded) record.verification = verification.get(record.public_id) || record.verification;
      await save();
      console.log(`${completed}/${unique.length} unique Cloudinary assets verified; ${failed} failed`);
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));
for (const record of uploaded) record.verification = verification.get(record.public_id) || record.verification;
report.verification_summary = {
  unique_assets: unique.length,
  mapped_images: uploaded.length,
  verified_assets: [...verification.values()].filter(item => item.status === 'verified').length,
  failed_assets: failed,
  skipped_files: report.files.length - uploaded.length,
  checked_at: new Date().toISOString(),
};
await save();
console.log(JSON.stringify(report.verification_summary));
if (failed) process.exitCode = 1;
