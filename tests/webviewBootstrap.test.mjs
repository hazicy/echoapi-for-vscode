import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import loadTypeScript from "./helpers/loadTypeScript.mjs";

test("embedded request data preserves script-like bodies without breaking the HTML", async () => {
  const { getHtmlForWebview } = await loadTypeScript(
    "src/extension/utils.ts",
    async (id) => {
      if (id === "os") return { platform: () => "darwin" };
      if (id === "@/shared/locale/language") return { language: "en" };
      return {};
    },
  );
  const data = {
    target_type: "api",
    initialData: {
      apiData: {
        request: { body: { raw: '</script><script>throw "injected"</script>\u2028\u2029' } },
      },
    },
  };
  const html = getHtmlForWebview("/tagPanel.js", "/dist", data, false);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  const window = {};
  vm.runInNewContext(scripts[0][1], {
    window,
    performance: { mark() {} },
    acquireVsCodeApi: () => ({}),
  });
  assert.deepEqual(JSON.parse(JSON.stringify(window.vscodeData)), data);
});
