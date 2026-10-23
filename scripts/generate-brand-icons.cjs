const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('@playwright/test');

// Marketplace icons and README images must be raster; SVGs remain the sources.
async function main() {
  const images = path.resolve(__dirname, '../public/images');
  const svg = await fs.readFile(path.join(images, 'okapi-icon.svg'), 'utf8');
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 256, height: 256 }, deviceScaleFactor: 1 });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:256px;height:256px}</style>${svg}`);
    const png = await page.screenshot({ omitBackground: true });
    for (const filename of ['okapi-icon.png', 'logo_icon.png', 'logo_icon_2x.png', 'logo.png', 'logo123.png']) {
      await fs.writeFile(path.join(images, filename), png);
    }
    const logo = await fs.readFile(path.join(images, 'okapi-logo.svg'), 'utf8');
    await page.setViewportSize({ width: 624, height: 192 });
    await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:624px;height:192px}</style>${logo}`);
    await page.screenshot({ path: path.join(images, 'okapi-logo.png'), omitBackground: true });
  } finally {
    await browser.close();
  }
  console.log('Generated okapi PNG icons and README logo from SVG sources.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
