import { expect, test } from "@playwright/test";
import { generateScopedName } from "../../scripts/css-modules.mjs";

const slotSelector = (name: string) =>
  `.${generateScopedName(name, "/ui/base/slots.module.css")}`;

for (const panel of [
  "sidePanel",
  "tagPanel",
  "environmentPanel",
  "pushPanel",
  "importDataPanel",
  "folderTestPanel",
  "folderTestReportPanel",
  "shareListPanel",
  "exportDataPanel",
]) {
  test(`production ${panel} initializes without module errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/smoke.html", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html lang="en"><head>
        <link rel="stylesheet" href="/webviews.css"></head><body><div id="root"></div>
        <script>window.vscode = { postMessage() {} }; window.vscodeData = null;
        window.resourceBaseUrl = location.origin;</script>
        <script type="module" src="/${panel}.js"></script></body></html>`,
      }),
    );
    await page.goto("http://127.0.0.1:4180/smoke.html");
    await expect(page.locator("#root > *")).not.toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

for (const panel of [
  "sidePanel",
  "tagPanel",
  "environmentPanel",
  "pushPanel",
  "importDataPanel",
  "folderTestPanel",
  "folderTestReportPanel",
  "shareListPanel",
  "exportDataPanel",
]) {
  test(`production ${panel} renders loaded application content`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
      console.error(panel, error.message);
    });
    await page.route("**/loaded.html", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><html lang="en" style="--vscode-foreground:#ccc;--vscode-icon-foreground:#aaa;--vscode-button-background:#78c4c0;--vscode-editor-background:#222;--vscode-sideBar-background:#222;--vscode-settings-headerBorder:#383838;--vscode-settings-focusedRowBackground:#282828;--vscode-toolbar-hoverBackground:#333;--vscode-gitDecoration-ignoredResourceForeground:#777;--vscode-input-placeholderForeground:#777;--vscode-input-background:#2e2e2e;--vscode-editorWidget-border:#333"><head><meta charset="utf-8"><link rel="stylesheet" href="/webviews.css"></head><body><div id="root"></div><script>window.vscode={postMessage(){}};window.vscodeData=null;window.resourceBaseUrl=location.origin;</script><script type="module" src="/${panel}.js"></script></body></html>`,
      }),
    );
    await page.goto("http://127.0.0.1:4180/loaded.html");
    await expect(page.locator("#root > *")).not.toHaveCount(0);
    await page.evaluate((panel) => {
      const send = (action: string, data: unknown) =>
        window.postMessage({ action, data }, "*");
      send("setUserConfig", {
        currentProject: {
          project_id: "-1",
          team_id: "",
          name: "Local Project",
          authority: 3,
          role: 1,
          is_describe_library: 1,
        },
        currentTeam: { team_id: "-1", name: "Local Team" },
        userInfo: {},
      });
      send("setProjectConfig", {});
      send("setSystemConfig", { raw_parameter_pilot_bubble_switch: false });
      if (["sidePanel", "shareListPanel", "importDataPanel"].includes(panel))
        send("setApiList", []);
      if (panel === "pushPanel")
        send("setPushPanelData", {
          local_api_list: [],
          project_apis_version: {},
        });
      if (panel === "folderTestPanel")
        send("setTestData", {
          testingName: "Test Folder",
          eventList: [],
          reportList: [],
          isInit: true,
        });
      if (panel === "folderTestReportPanel")
        send("setReportDetails", {
          folderName: "Report",
          requestList: [],
          complete: {},
          testingConfig: { name: "Report", runTimes: 1 },
          eventAllCount: 0,
        });
      if (panel === "tagPanel")
        send("setApiData", {
          target_id: "test-api",
          target_type: "api",
          project_id: "-1",
          parent_id: "0",
          name: "Test Request",
          method: "GET",
          url: "",
          description: "",
          tags: [],
          attribute_info: {},
          is_force: -1,
          is_locked: -1,
          ai_expect_enable: -1,
          ai_expect: { list: [] },
          request: {
            auth: { type: "noauth" },
            body: {
              mode: "none",
              parameter: [],
              raw: "",
              raw_parameter: [],
              raw_schema: { type: "object" },
              binary: null,
            },
            header: { parameter: [] },
            query: { parameter: [{param_id:"query-1",key:"search",value:"hello",field_type:"String",is_checked:1}], query_add_equal: 1 },
            restful: { parameter: [] },
            cookie: { parameter: [] },
            pre_tasks: [],
            post_tasks: [],
          },
          response: { is_check_result: 1, example: [] },
        });
    }, panel);
    if (panel === "folderTestReportPanel") {
      await expect(
        page.locator(`#root ${slotSelector("beautify-spin-container")}`).first(),
      ).toHaveAttribute("aria-busy", "false");
    } else {
      await expect(page.locator(`#root ${slotSelector("beautify-skeleton")}`)).toHaveCount(0);
    }
    await expect(page.locator("#root")).not.toHaveText("");
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    if (panel === "sidePanel") {
      for (const width of [280, 380]) {
        await page.setViewportSize({width, height:900});
        const group = page.locator(slotSelector('beautify-new-http-more'));
        const main = group.locator('button').first();
        const groupBox = await group.boundingBox();
        const mainBox = await main.boundingBox();
        expect(groupBox!.width).toBeGreaterThan(width - 40);
        expect(mainBox!.height).toBeLessThanOrEqual(32);
        expect(mainBox!.width).toBeGreaterThan(180);
        await expect(group.getByRole('button', {name:'More actions'})).toBeVisible();
      }
      await page.screenshot({path: test.info().outputPath('sidebar.png')});
    }
    if (panel === "tagPanel") {
      for (const width of [760, 1024]) {
        await page.setViewportSize({width, height:900});
        await page.getByRole('tab').filter({hasText:/^Params(?:\s*\d+)?$/}).click();
        const table = page.getByRole('tabpanel', {name:/^Params(?:\s*\d+)?$/}).locator('table');
        await expect(table).toHaveCSS('table-layout', 'fixed');
        const key = table.locator('[contenteditable=true]').filter({hasText:'search'});
        const value = table.locator('[contenteditable=true]').filter({hasText:'hello'});
        await expect(key).toBeVisible();
        await expect(value).toBeVisible();
        for (const editor of [key, value]) {
          const box = await editor.boundingBox();
          expect(box!.width).toBeGreaterThan(100);
          expect(box!.height).toBeGreaterThan(10);
        }
      }
      await page.screenshot({path: test.info().outputPath('request.png')});
    }
    expect(errors).toEqual([]);
  });
}
