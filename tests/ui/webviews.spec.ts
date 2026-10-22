import { expect, test } from '@playwright/test';

for (const panel of ['sidePanel', 'tagPanel', 'environmentPanel', 'pushPanel', 'importDataPanel',
  'folderTestPanel', 'folderTestReportPanel', 'shareListPanel', 'exportDataPanel']) {
  test(`production ${panel} initializes without module errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/smoke.html', route => route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html lang="en"><head>
        <link rel="stylesheet" href="/webviews.css"></head><body><div id="root"></div>
        <script>window.vscode = { postMessage() {} }; window.vscodeData = null;
        window.resourceBaseUrl = location.origin;</script>
        <script type="module" src="/${panel}.js"></script></body></html>`,
    }));
    await page.goto('http://127.0.0.1:4180/smoke.html');
    await expect(page.locator('#root > *')).not.toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
