import { expect, test } from "@playwright/test";
import { generateScopedName } from "../../scripts/css-modules.mjs";

const requestInitialData = {
          projectConfig: {},
          systemConfig: { raw_parameter_pilot_bubble_switch: false },
          vscodeTheme: "Default Dark Modern",
          docBaseUrl: "http://localhost:3000",
          apiData: {
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
          },
        };

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
        <script>window.vscode = { postMessage() {} }; window.vscodeData = ${JSON.stringify(panel === "tagPanel" ? {target_type: "api", initialData: requestInitialData} : null)};
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
        body: `<!doctype html><html lang="en" style="--vscode-foreground:#ccc;--vscode-icon-foreground:#aaa;--vscode-button-background:#78c4c0;--vscode-editor-background:#222;--vscode-sideBar-background:#222;--vscode-settings-headerBorder:#383838;--vscode-settings-focusedRowBackground:#282828;--vscode-toolbar-hoverBackground:#333;--vscode-gitDecoration-ignoredResourceForeground:#777;--vscode-input-placeholderForeground:#777;--vscode-input-background:#2e2e2e;--vscode-editorWidget-border:#333"><head><meta charset="utf-8"><link rel="stylesheet" href="/webviews.css"></head><body><div id="root"></div><script>window.vscode={postMessage(){}};window.vscodeData=${JSON.stringify(panel === "tagPanel" ? {target_type: "api", initialData: requestInitialData} : null)};window.resourceBaseUrl=location.origin;</script><script type="module" src="/${panel}.js"></script></body></html>`,
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

    }, panel);
    if (panel === "folderTestReportPanel") {
      await expect(
        page.locator(`#root ${slotSelector("beautify-spin-container")}`).first(),
      ).toHaveAttribute("aria-busy", "false");
    } else {
      await expect(page.locator(`#root ${slotSelector("beautify-skeleton")}`)).toHaveCount(0);
    }
    await expect(page.locator("#root")).not.toHaveText("");
    if (panel === "tagPanel") {
      await expect.poll(() => page.evaluate(() =>
        performance.getEntriesByName("okapi:content-ready").length,
      )).toBe(1);
    }
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    if (panel === "sidePanel") {
      await page.evaluate(() => {
        (window as any).__sidebarMessages = [];
        (window as any).vscode.postMessage = (message: unknown) => (window as any).__sidebarMessages.push(message);
        window.postMessage({action:'setApiList', data:[{
          target_id:'sample-folder', parent_id:'0', target_type:'folder',
          name:'Samples', status:0, sort:0,
        }]}, '*');
      });
      for (const width of [240, 280, 380]) {
        await page.setViewportSize({width, height:900});
        const group = page.locator(slotSelector('beautify-new-http-more'));
        const main = group.locator('button').first();
        const groupBox = await group.boundingBox();
        const mainBox = await main.boundingBox();
        expect(groupBox!.x).toBeGreaterThanOrEqual(0);
        expect(groupBox!.x + groupBox!.width).toBeLessThanOrEqual(width);
        expect(mainBox!.height).toBeLessThanOrEqual(32);
        expect(mainBox!.width).toBeGreaterThan(50);
        await expect(group.getByRole('button', {name:'More actions'})).toBeVisible();
        const tabs = page.getByRole('tab');
        await expect(tabs.first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await tabs.nth(1).click();
        await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
        const folderInput = page.getByRole('combobox');
        await expect(folderInput).toBeVisible();
        await expect(folderInput).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        const folderBox = await folderInput.boundingBox();
        expect(folderBox!.width).toBeGreaterThan(30);
        expect(folderBox!.x + folderBox!.width).toBeLessThan(width);
        await tabs.first().click();
        await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      }
      await page.getByRole('tab').nth(1).click();
      const run = page.getByRole('button', {name: /Run all/i});
      await expect(run).toBeDisabled();
      await page.getByRole('combobox').click();
      await page.getByText('Samples', {exact:true}).last().click();
      await expect(run).toBeEnabled();
      await run.click();
      await expect.poll(() => page.evaluate(() => (window as any).__sidebarMessages.some((m: any) => m.action === 'runFolder' && m.data.target_id === 'sample-folder'))).toBe(true);
      await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(900);
      await page.screenshot({path: test.info().outputPath('sidebar.png')});
    }
    if (panel === "tagPanel") {
      for (const width of [760, 1024]) {
        await page.setViewportSize({width, height:900});
        const embeddedSelects = page.locator(slotSelector('url-group-wrap')).locator(slotSelector('beautify-select'));
        for (const select of await embeddedSelects.all()) {
          await expect(select).toHaveCSS('border-top-width', '0px');
          await expect(select).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        }
        await page.getByRole('tab').filter({hasText:/^Params(?:\s*\d+)?$/}).click();
        const paramsTab = page.getByRole('tab').filter({hasText:/^Params(?:\s*\d+)?$/});
        const count = paramsTab.locator(slotSelector('tabs-count-badge'));
        await expect(count).toHaveText('1');
        const tabBox = await paramsTab.boundingBox();
        const countBox = await count.boundingBox();
        expect(Math.abs((tabBox!.y + tabBox!.height / 2) - (countBox!.y + countBox!.height / 2))).toBeLessThanOrEqual(2);
        const table = page.getByRole('tabpanel', {name:/^Params(?:\s*\d+)?$/}).locator('table');
        await expect(table).toHaveCSS('table-layout', 'fixed');
        const selectAll = table.locator('th').getByRole('checkbox').first();
        await expect(selectAll).toHaveCSS('width', '16px');
        await expect(selectAll).toHaveCSS('padding-right', '0px');
        const key = table.getByRole('textbox').nth(0);
        const value = table.getByRole('textbox').nth(1);
        await expect(key).toHaveValue('search');
        await expect(value).toHaveValue('hello');
        await expect(key).toBeVisible();
        await expect(value).toBeVisible();
        for (const editor of [key, value]) {
          const box = await editor.boundingBox();
          expect(box!.width).toBeGreaterThan(100);
          expect(box!.height).toBeGreaterThan(10);
        }
        const urlInput = page.getByRole('textbox', {name:'Enter URL or paste cURL text'});
        for (const editor of [urlInput, key, value]) {
          await page.getByRole('tab').filter({hasText:/^Params(?:\s*\d+)?$/}).click();
          const measure = () => editor.evaluate(element => {
            const box = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              x:box.x, y:box.y, width:box.width, height:box.height,
              textX:box.x + parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth),
              textY:box.y + parseFloat(style.paddingTop) + parseFloat(style.borderTopWidth),
            };
          });
          const before = await measure();
          await editor.click();
          await expect(editor).toBeFocused();
          expect(await measure()).toEqual(before);
        }
      }
      const urlGroup = page.locator(slotSelector('url-group-wrap'));
      const protocol = urlGroup.locator(slotSelector('right-select-http')).last();
      await expect(protocol.getByRole('combobox')).toHaveCount(1);
      for (let attempt = 0; attempt < 3; attempt++) {
        const trigger = protocol.getByRole('combobox');
        const triggerBox = await trigger.boundingBox();
        await trigger.click(attempt === 1 ? {position:{x:8,y:12}} : attempt === 2 ? {position:{x:triggerBox!.width - 8,y:12}} : {});
        // Catch focus/blur closures after the opening pointer event completes.
        await page.waitForTimeout(300);
        await expect(page.getByRole('option', {name:'http/1.1', exact:true})).toBeVisible();
        const nextProtocol = attempt === 1 ? 'http/2' : 'http/1.1';
        await page.getByRole('option', {name:nextProtocol, exact:true}).click();
        await expect(trigger).toContainText(nextProtocol);
        await expect(page.getByRole('option', {name:'http/1.1', exact:true})).toBeHidden();
      }
      await protocol.getByRole('combobox').click();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('option', {name:'http/1.1', exact:true})).toBeHidden();
      const method = urlGroup.locator(slotSelector('beautify-select')).first();
      await method.locator('button').click();
      await page.waitForTimeout(300);
      await expect(page.getByTitle('POST', {exact:true})).toBeVisible();
      await page.getByTitle('POST', {exact:true}).click();
      await expect(method.getByRole('combobox')).toHaveAttribute('placeholder', 'POST');
      await expect(page.getByTitle('POST', {exact:true})).toBeHidden();
      await page.screenshot({path: test.info().outputPath('request.png')});
      await page.evaluate(() => {
        window.postMessage({action:'setSystemConfig', data:{tab_direction:1, assertions_and_validation_results:-1, send_after_auto_beautify:1, raw_parameter_pilot_bubble_switch:false}}, '*');
        window.postMessage({action:'apiSendResult', data:JSON.stringify({
          target_id:'test-api', sendStatus:'initial', timestamp:Date.now(),
          responseHeaders:{'content-type':'text/html', server:'test'},
          cookies:[], asserts:[], consoleList:[], requestHeaders:{},
          response:{code:200, status:'OK', response_time:572, response_size:580000,
            mime_type:{ext:'html',mime:'text/html'}, fit_for_show:'Monaco',
            raw_body:'<!DOCTYPE html>\n<html lang="en">\n<head><title>Response preview</title></head>\n<body><h1>Sample response</h1></body>\n</html>',
          },
        })}, '*');
      });
      for (const width of [760, 1200]) {
        await page.setViewportSize({width,height:900});
        const toolbar = page.locator(slotSelector('response-result-tabs-wrap'));
        const wrapButton = toolbar.getByRole('button', {name:'Toggle word wrap'});
        await expect(wrapButton).toBeVisible();
        await expect(wrapButton).toHaveCSS('height','28px');
        const tools = toolbar.locator(slotSelector('tab-bar-extra-content-wrap')).last();
        const controls = tools.locator(slotSelector('beautify-select'));
        for (const control of await controls.all()) {
          const box = await control.boundingBox();
          const buttonBox = await wrapButton.boundingBox();
          expect(Math.abs(box!.y + box!.height / 2 - buttonBox!.y - buttonBox!.height / 2)).toBeLessThanOrEqual(2);
        }
        await wrapButton.click();
        await expect(wrapButton).toHaveAttribute('aria-pressed','false');
        await wrapButton.click();
        await expect(wrapButton).toHaveAttribute('aria-pressed','true');
        await expect(page.getByRole('textbox',{name:'Code editor'}).first()).toBeVisible();
        await page.screenshot({path:test.info().outputPath(`response-${width}.png`)});
      }
    }
    expect(errors).toEqual([]);
  });
}
