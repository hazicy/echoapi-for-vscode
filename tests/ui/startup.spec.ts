import { expect, test } from "@playwright/test";

for (const initializationDelay of [0, 250]) {
  test(`request startup with ${initializationDelay}ms initialization keeps one loading placeholder and defers optional modules`, async ({
    page,
  }) => {
    const errors: string[] = [];
    const scripts: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "script") scripts.push(request.url());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/startup.html", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html lang="en"><head>
      <link rel="stylesheet" href="/webviews.css"></head><body><div id="root"></div>
      <script>
      performance.mark('okapi:html-ready');
      window.vscodeData = { target_type: 'api' };
      window.loadingRowCounts = [];
      new MutationObserver(() => {
        if (!performance.getEntriesByName('okapi:content-ready').length) {
          document.querySelectorAll('[aria-label="Loading"]').forEach(element => {
            window.loadingRowCounts.push(element.children.length);
          });
        }
      }).observe(document.getElementById('root'), { childList: true, subtree: true });
      window.startupMessages = [];
      window.resourceBaseUrl = location.origin;
      window.vscode = { postMessage(message) {
        window.startupMessages.push({ action: message.action,
          contentReady: performance.getEntriesByName('okapi:content-ready').length });
        if (message.action === 'getInitialData') {
          setTimeout(() => window.dispatchEvent(new MessageEvent('message', { data: {
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
          }})), ${initializationDelay});
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
    expect(
      await page.evaluate(() => (window as any).loadingRowCounts),
    ).not.toContain(3);
    await expect(page.getByLabel("Loading", { exact: true })).toHaveCount(0);
    // A hidden request tab must not fetch its module until first selected,
    // even though the underlying Tabs panels use keepMounted.
    await page.waitForLoadState("networkidle");
    const startupPayload = await page.evaluate(() => {
      const scripts = (
        performance.getEntriesByType("resource") as PerformanceResourceTiming[]
      ).filter((entry) => new URL(entry.name).pathname.endsWith(".js"));
      return {
        jsFiles: scripts.length,
        jsBytes: scripts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
        contentMilliseconds: performance.getEntriesByName(
          "okapi:html-to-content",
        )[0]?.duration,
      };
    });
    console.log("Request startup payload:", JSON.stringify(startupPayload));
    const startupScriptCount = scripts.length;
    await page.getByRole("tab", { name: "Path", exact: true }).click();
    await expect.poll(() => scripts.length).toBeGreaterThan(startupScriptCount);
    await expect(
      page.getByRole("tab", { name: "Path", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tab", { name: "Params", exact: true }).click();
    await page.waitForLoadState("networkidle");
    const beforeConsole = scripts.length;
    await page.getByRole("tab", { name: "Console", exact: true }).click();
    await expect.poll(() => scripts.length).toBeGreaterThan(beforeConsole);
    await page.getByRole("tab", { name: "Response", exact: true }).click();
    // The deferred response implementation must still handle host results.
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            action: "apiSendResult",
            data: JSON.stringify({
              sendStatus: "sendError",
              message: "Startup deferred response check",
            }),
          },
        }),
      );
    });
    await expect(
      page.getByText("Startup deferred response check", { exact: true }),
    ).toBeVisible();
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            action: "apiSendResult",
            data: JSON.stringify({
              target_id: "startup-api",
              sendStatus: "initial",
              timestamp: Date.now(),
              responseHeaders: { "content-type": "application/json" },
              cookies: [],
              asserts: [],
              consoleList: [],
              requestHeaders: {},
              response: {
                code: 200,
                status: "OK",
                response_time: 10,
                response_size: 11,
                mime_type: { ext: "json", mime: "application/json" },
                fit_for_show: "Monaco",
                raw_body: '{"ok":true}',
              },
            }),
          },
        }),
      );
    });
    await expect(
      page.getByRole("button", { name: "Toggle word wrap" }),
    ).toBeVisible();
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
}
