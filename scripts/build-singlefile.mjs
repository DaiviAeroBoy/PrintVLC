import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const htmlPath = path.join(distDir, 'index.html');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(htmlPath)) {
  console.error('dist/index.html not found. Run npm run build first.');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');
const assetFiles = fs.readdirSync(assetsDir);

const cssFile = assetFiles.find(f => f.endsWith('.css'));
const jsFile = assetFiles.find(f => f.endsWith('.js'));

if (cssFile) {
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
  // Replace <link rel="stylesheet" ...> with <style>...</style>
  html = html.replace(/<link[^>]+rel="stylesheet"[^>]+>/i, `<style>\n${cssContent}\n</style>`);
}

if (jsFile) {
  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
  // Replace <script type="module" ...></script> with inline <script type="module">...</script>
  html = html.replace(/<script[^>]+type="module"[^>]+src="[^"]+"[^>]*><\/script>/i, `<script type="module">\n${jsContent}\n</script>`);
}

const outputPath = path.resolve('PrintVLC.html');
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Successfully generated 100% self-contained single-file: ${outputPath} (${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);
