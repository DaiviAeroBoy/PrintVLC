import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = path.resolve('.');
const zipName = 'PrintVLC-Portable.zip';
const zipPath = path.join(rootDir, zipName);
const tempZipPath = path.join(rootDir, 'PrintVLC-Portable-temp.zip');

// Clean up existing temp zip if any
if (fs.existsSync(tempZipPath)) {
  fs.unlinkSync(tempZipPath);
}

// Items to include
const excluded = new Set([
  '.git',
  'node_modules',
  'dist',
  zipName,
  'PrintVLC-Portable-temp.zip'
]);

const entries = fs.readdirSync(rootDir).filter(item => !excluded.has(item));

console.log(`Packaging ${entries.length} items into ${zipName}...`);

try {
  // Use bsdtar built-in on Windows 10/11
  const quotedEntries = entries.map(e => `"${e}"`).join(' ');
  execSync(`tar -a -c -f "${tempZipPath}" ${quotedEntries}`, { cwd: rootDir, stdio: 'inherit' });

  if (fs.existsSync(tempZipPath)) {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    fs.renameSync(tempZipPath, zipPath);
    const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
    console.log(`Successfully generated ${zipName} (${sizeMb} MB)`);
  } else {
    throw new Error('Temporary zip was not created.');
  }
} catch (err) {
  console.error('Error creating zip archive:', err.message);
  process.exit(1);
}
