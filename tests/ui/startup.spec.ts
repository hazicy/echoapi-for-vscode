import { expect, test } from "@playwright/test";

test("request startup handles immediate initialization and defers collection and code generation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/startup.html", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><html lang="en"><head>
      <link rel="stylesheet" href="/webviews.css"></head><body><div id="root"></div>
      <script>
      performance.mark('okapi:html-ready');
      window.startupMessages = [];
      window.resourceBaseUrl = location.origin;
      window.vscode = { postMessage(message) {
        window.startupMessages.push({ action: message.action,
          contentReady: performance.getEntriesByName('okapi:content-ready').length });
        if (message.action === 'getInitialData') {
          window.dispatchEvent(new MessageEvent('message', { data: {
            action: 'setInitialData', data: {
              projectConfig: {}, systemConfig: { raw_parameter_pilot_bubble_switch: false },
              vscodeTheme: 'Default Dark Modern', docBaseUrl: '',
              apiData: {
                target_id: 'startup-api', target_type: 'api', project_id: '-1',
                parent_id: '0', name: 'Startup request', method: 'GET', url: '',
                description: '', tags: [], attribute_info: {}, is_force: -1,
                is_locked: -1, ai_expect_enable: -1, ai_expect: { list: [] },
                request: {
                  auth: { type: 'noauth' },
                  body: { mode: 'none', parameter: [], raw: '', raw_parameter: [],
                    raw_schema: { type: 'object' }, binary: null },
                  header: { parameter: [] }, query: { parameter: [], query_add_equal: 1 },
                  restful: { parameter: [] }, cookie: { parameter: [] },
                  pre_tasks: [], post_tasks: []
                }, response: { is_check_result: 1, example: [] }
              }
            }
          }}));
        }
        if (message.action === 'getApiList') {
          window.dispatchEvent(new MessageEvent('message', {
            data: { action: 'setApiList', data: [] }
          }));
        }
      }};
      </script><script type="module" src="/tagPanel.js"></script></body></html>`,
    }),
  );
  await page.goto("http://127.0.0.1:4180/startup.html");
  await expect(
    page.getByPlaceholder("Enter URL or paste cURL text"),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as any).startupMessages.filter(
          (message: any) => message.action === "getApiList",
        ),
      ),
    )
    .toEqual([{ action: "getApiList", contentReady: 1 }]);
  const actions = await page.evaluate(() =>
    (window as any).startupMessages.map((message: any) => message.action),
  );
  expect(actions).toContain("getInitialData");
  for (const action of [
    "getApiData",
    "getProjectConfig",
    "getSystemConfig",
    "getVscodeTheme",
    "getDocBaseUrl",
    "getCodeHar",
  ]) {
    expect(actions).not.toContain(action);
  }
  expect(
    await page.evaluate(
      () => performance.getEntriesByName("okapi:html-to-content").length,
    ),
  ).toBe(1);
  await page.getByRole("button", { name: "Code", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as any).startupMessages.some(
          (message: any) => message.action === "getCodeHar",
        ),
      ),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});
