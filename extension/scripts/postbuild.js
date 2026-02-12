import fs from 'fs';
import path from 'path';

const distManifestPath = path.resolve(process.cwd(), 'dist', 'manifest.json');

if (!fs.existsSync(distManifestPath)) {
  console.error('dist/manifest.json not found; build may have failed');
  process.exit(1);
}

const manifestRaw = fs.readFileSync(distManifestPath, 'utf-8');
const manifest = JSON.parse(manifestRaw);

// Rewrite paths to use compiled outputs
if (manifest.background && manifest.background.service_worker) {
  manifest.background.service_worker = 'background.js';
}

if (manifest.action && manifest.action.default_popup) {
  manifest.action.default_popup = 'popup/index.html';
}

if (manifest.chrome_url_overrides && manifest.chrome_url_overrides.newtab) {
  manifest.chrome_url_overrides.newtab = 'newtab/index.html';
}

if (manifest.options_ui && manifest.options_ui.page) {
  manifest.options_ui.page = 'options/index.html';
}

if (Array.isArray(manifest.content_scripts)) {
  for (const cs of manifest.content_scripts) {
    if (Array.isArray(cs.js)) {
      cs.js = cs.js.map(() => 'content.js');
    }
  }
}

// Ensure icons stay relative to public
if (manifest.icons) {
  // leave as-is (public/icons/...)
}

fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log('dist/manifest.json updated to reference built files');

// Move HTML files from dist/src/<page>/index.html -> dist/<page>/index.html and fix paths
const pages = ['newtab', 'popup', 'options'];
for (const p of pages) {
  const srcHtml = path.resolve(process.cwd(), 'dist', 'src', p, 'index.html');
  const outDir = path.resolve(process.cwd(), 'dist', p);
  const outHtml = path.resolve(outDir, 'index.html');
  if (fs.existsSync(srcHtml)) {
    let html = fs.readFileSync(srcHtml, 'utf-8');

    // Replace references to built main file (e.g. ../../newtab/main.js) with ./main.js
    html = html.replace(/src="[^"]*\/\w+\/main\.js"/, 'src="./main.js"');

    // Fix modulepreload hrefs from ../../assets/... to ../assets/...
    html = html.replace(/href="\.\.\/\.\.\/assets\//g, 'href="../assets/');

    // Ensure links to assets starting with ../../assets/ become ../assets/
    html = html.replace(/\.\.\/\.\.\/assets\//g, '../assets/');

    // Create output directory and write updated HTML
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outHtml, html, 'utf-8');
    console.log(`Moved and patched ${srcHtml} -> ${outHtml}`);

    // Optional: remove the src directory to avoid confusion
    try {
      fs.rmSync(path.resolve(process.cwd(), 'dist', 'src', p), { recursive: true, force: true });
    } catch (e) {
      // ignore
    }
  }
}

// Remove any remaining dist/src directory to avoid accidental src references in final package
const distSrcDir = path.resolve(process.cwd(), 'dist', 'src');
if (fs.existsSync(distSrcDir)) {
  try {
    fs.rmSync(distSrcDir, { recursive: true, force: true });
    console.log('Removed leftover', distSrcDir);
  } catch (e) {
    console.warn('Could not remove dist/src:', e.message);
  }
}
