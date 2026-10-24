const { test } = require("node:test");
const assert = require("node:assert/strict");
const { build } = require("esbuild");
const Module = require("node:module");
const path = require("node:path");

test("native sidebar panels, test commands and workspace request history", async () => {
  const views = new Map();
  const commands = new Map();
  const writes = new Map();
  const executed = [];
  const rows = [
    {
      target_id: "folder",
      target_type: "folder",
      parent_id: "0",
      name: "Samples",
      is_deleted: -1,
    },
    {
      target_id: "nested",
      target_type: "folder",
      parent_id: "folder",
      name: "Nested",
      is_deleted: -1,
    },
    {
      target_id: "request",
      target_type: "api",
      parent_id: "nested",
      name: "Get user",
      method: "GET",
      url: "/users",
      is_deleted: -1,
    },
  ];
  const report = {
    report_id: "report",
    report_name: "Samples run",
    complete: { start_at: Date.now(), http: { total: 1, success: 1 } },
  };
  let nextId = 0;
  class EventEmitter {
    listeners = [];
    event = (listener) => {
      this.listeners.push(listener);
      return { dispose() {} };
    };
    fire = (value) => this.listeners.forEach((listener) => listener(value));
    dispose() {}
  }
  const context = { subscriptions: [], project: "one", extensionUri: "/extension" };
  const mocks = {
    vscode: {
      EventEmitter,
      Uri: { joinPath: (...parts) => parts.join("/") },
      TreeItem: class {
        constructor(label, collapsibleState) {
          Object.assign(this, { label, collapsibleState });
        }
      },
      ThemeIcon: class {
        constructor(id, color) {
          Object.assign(this, { id, color });
        }
      },
      ThemeColor: class {
        constructor(id) {
          this.id = id;
        }
      },
      TreeItemCollapsibleState: { None: 0, Collapsed: 1, Expanded: 2 },
      env: { language: "zh-cn" },
      window: {
        createTreeView: (id, options) => {
          views.set(id, options.treeDataProvider);
          return { dispose() {} };
        },
        showInputBox: async () => "Get user",
        showQuickPick: async (items) => items[0],
      },
      commands: {
        registerCommand: (id, fn) => {
          commands.set(id, fn);
          return { dispose() {} };
        },
        executeCommand: (...args) => executed.push(args),
      },
    },
    utils: {
      getApiList: () => rows,
      getProjectReportList: () => [report],
      getApiListName: (ctx) => `apiList:${ctx.project}`,
    },
    db: {
      getDataFromGlobalStorage: (_, key, fallback) =>
        writes.get(key) ?? fallback,
      setDataToGlobalStorage: (_, key, value) => writes.set(key, value),
    },
    sidbar: { handleMessage: () => true },
    apis: { copyAsCurl: (...args) => executed.push(["copyAsCurl", ...args]) },
    common: {
      APIS_BASE_DEFAULT_DATA: { api: { response: { restored: true } } },
    },
    constants: { APIS_TARGET_TYPE_ENUM: { API: "api", FOLDER: "folder", SSE: "sse", GRAPHQL: "graphql", WEBSOCKET2: "websocket2", SOCKETIO: "socketio" } },
    "apipost-tools": { snowflakeId: () => String(++nextId) },
  };
  globalThis.__okapiNativeMocks = mocks;
  try {
    const result = await build({
      stdin: {
        contents:
          "export { registerNativeTree } from './src/extension/nativeTree'; export { recordRequestHistory, getRequestHistory } from './src/extension/requestHistory'; export { storageChanged } from './src/extension/storageEvents'; export { requestChildren } from './src/extension/nativeTreeData';",
        resolveDir: path.resolve(__dirname, ".."),
      },
      bundle: true,
      write: false,
      platform: "node",
      format: "cjs",
      plugins: [
        {
          name: "native-test-dependencies",
          setup(builder) {
            builder.onResolve(
              {
                filter:
                  /^(vscode|apipost-tools)$|(^|\/)(utils|db|sidbar|common|apis)$|^@\/features\/requests\/constants$/,
              },
              (args) => {
                const key =
                  args.path === "@/features/requests/constants"
                    ? "constants"
                    : args.path.split("/").pop();
                if (mocks[key]) {
                  return { path: key, namespace: "mock" };
                }
              },
            );
            builder.onLoad({ filter: /.*/, namespace: "mock" }, (args) => ({
              contents: `module.exports = globalThis.__okapiNativeMocks[${JSON.stringify(args.path)}]`,
              loader: "js",
            }));
          },
        },
      ],
    });
    const filename = path.join(__dirname, "nativeTree.bundle.cjs");
    const bundled = new Module(filename);
    bundled.paths = module.paths;
    bundled._compile(result.outputFiles[0].text, filename);
    const {
      registerNativeTree,
      recordRequestHistory,
      getRequestHistory,
      storageChanged,
      requestChildren,
    } = bundled.exports;
    registerNativeTree(context);
    assert.deepEqual(
      [...views.keys()],
      ["okapiRequests", "okapiTests", "okapiHistory"],
    );
    const beforeCreate = executed.length;
    mocks.sidbar.handleMessage = () => false;
    await commands.get("okapi.tree.new")();
    assert.equal(executed.length, beforeCreate);
    mocks.sidbar.handleMessage = () => true;
    await commands.get("okapi.tree.new")();
    assert.equal(executed.at(-1)[0], "openTabPanel");
    const originalPicker = mocks.vscode.window.showQuickPick;
    mocks.common.APIS_BASE_DEFAULT_DATA.websocket2 = { message: [{ request: { raw: "" } }] };
    mocks.vscode.window.showQuickPick = async (items) => {
      assert.equal(items.some((item) => item.type === "websocket"), false);
      return items.find((item) => item.type === "websocket2");
    };
    await commands.get("okapi.tree.new")();
    assert.equal(executed.at(-1)[1].target_type, "websocket2");
    assert.equal(executed.at(-1)[1].message.length, 1);
    mocks.vscode.window.showQuickPick = originalPicker;
    const requests = views.get("okapiRequests");
    for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]) {
      const item = requests.getTreeItem({ kind: "request", data: { ...rows[2], method } });
      assert.equal(item.iconPath.id, "globe");
      assert.equal(item.iconPath.color, undefined);
      assert.equal(item.description, method);
    }
    assert.equal(requests.getTreeItem({ kind: "request", data: rows[0] }).iconPath.id, "folder");
    assert.equal(requests.getTreeItem({ kind: "request", data: rows[0] }).iconPath.color.id, "textLink.foreground");
    assert.equal(requests.getTreeItem({ kind: "request", data: { ...rows[2], target_type: "graphql" } }).iconPath.id, "type-hierarchy");
    assert.equal(requests.getTreeItem({ kind: "request", data: { ...rows[2], method: "CUSTOM" } }).iconPath.id, "globe");
    for (const [protocol, icon] of Object.entries({ sse: "broadcast", graphql: "type-hierarchy", websocket2: "debug-disconnect", socketio: "plug", grpc: "server-process", socket: "plug", socket_method: "symbol-method", doc: "file-text" })) {
      const item = requests.getTreeItem({ kind: "request", data: { ...rows[2], target_type: protocol } });
      assert.equal(item.iconPath.id, icon);
      assert.equal(item.iconPath.color, undefined);
    }
    const folderNode = { kind: "request", data: rows[0] };
    const requestNode = { kind: "request", data: rows[2] };
    const messages = [];
    mocks.sidbar.handleMessage = (message) => { messages.push(message); return true; };
    const originalInput = mocks.vscode.window.showInputBox;
    mocks.vscode.window.showInputBox = async () => " Renamed ";
    await commands.get("okapi.tree.rename")(requestNode);
    assert.equal(messages.at(-1).action, "saveFolder");
    assert.equal(messages.at(-1).data.name, "Renamed");
    assert.equal(rows[2].name, "Get user");
    const messageCount = messages.length;
    mocks.vscode.window.showInputBox = async () => undefined;
    await commands.get("okapi.tree.rename")(folderNode);
    assert.equal(messages.length, messageCount);
    mocks.vscode.window.showInputBox = async () => { context.project = "two"; return "Wrong workspace"; };
    await commands.get("okapi.tree.rename")(folderNode);
    assert.equal(messages.length, messageCount);
    context.project = "one";
    mocks.vscode.window.showInputBox = originalInput;
    await commands.get("okapi.tree.clone")(requestNode);
    assert.deepEqual(messages.at(-1), { action: "cloneApi", data: { target_id: "request" } });
    await commands.get("okapi.tree.delete")(folderNode);
    assert.equal(messages.at(-1).action, "showConfirmation");
    assert.equal(messages.at(-1).data.target_id, "folder");
    await commands.get("okapi.tree.folderSettings")(folderNode);
    assert.deepEqual(messages.at(-1), { action: "openTagPanelById", data: "folder" });
    await commands.get("okapi.tree.revealStorage")(requestNode);
    assert.equal(messages.at(-1).action, "openVscodeFileExplorer");
    await commands.get("okapi.tree.folderReports")(folderNode);
    assert.deepEqual(executed.at(-1), ["echoapi.folderTest", rows[0], { openHistoryReport: true }]);
    await commands.get("okapi.tree.copyCurl")(requestNode);
    assert.equal(executed.at(-1)[0], "copyAsCurl");
    assert.equal(executed.at(-1)[1].parent_id, "0");
    assert.equal(rows[2].parent_id, "nested");
    await commands.get("okapi.tree.new")(folderNode, "folder");
    assert.equal(messages.at(-1).data.parent_id, "folder");
    assert.equal(messages.at(-1).data.target_type, "folder");
    const manifest = require("../package.json");
    for (const item of manifest.contributes.menus["view/item/context"].filter((item) => item.command.startsWith("okapi.tree."))) {
      assert.ok(commands.has(item.command), `missing handler: ${item.command}`);
    }
    mocks.sidbar.handleMessage = () => true;
    const tests = views.get("okapiTests");
    const history = views.get("okapiHistory");
    let refreshes = 0;
    requests.onDidChangeTreeData(() => refreshes++);
    storageChanged.fire("unrelated");
    assert.equal(refreshes, 0);
    storageChanged.fire("apiList:one");
    storageChanged.fire("one:test");
    storageChanged.fire("userConfig");
    assert.equal(refreshes, 3);
    const orphan = {
      ...rows[2],
      target_id: "orphan",
      parent_id: "missing",
      sort: 2,
    };
    assert.equal(requestChildren([...rows, orphan]).at(-1).target_id, "orphan");
    const cycle = [{ ...rows[0], parent_id: "nested" }, rows[1], rows[2]];
    assert.deepEqual(requestChildren(cycle, undefined, "get user"), []);
    assert.equal(requests.getChildren()[0].kind, "request");
    assert.equal(
      requests.getChildren(requests.getChildren()[0])[0].data.target_id,
      "nested",
    );
    const testFolder = tests.getChildren()[0];
    assert.equal(testFolder.kind, "testFolder");
    await commands.get("okapi.tree.runTests")(testFolder);
    assert.equal(executed.at(-1)[0], "echoapi.folderTest");
    const reports = tests.getChildren().find((node) => node.kind === "reports");
    await commands.get("okapi.tree.openReport")(tests.getChildren(reports)[0]);
    assert.deepEqual(executed.at(-1), ["echoapi.folderTestReportData", report]);
    assert.equal(history.getChildren()[0].kind, "empty");
    const sent = { ...rows[2], response: { raw: "large body" } };
    recordRequestHistory(context, sent);
    sent.url = "/changed";
    assert.equal(getRequestHistory(context)[0].request.url, "/users");
    assert.equal(getRequestHistory(context)[0].request.response, undefined);
    const day = history.getChildren()[0];
    assert.equal(day.kind, "day");
    const entry = history.getChildren(day)[0];
    await commands.get("okapi.tree.openHistory")(entry);
    assert.equal(executed.at(-1)[0], "openTabPanel");
    assert.notEqual(executed.at(-1)[1].target_id, "request");
    assert.deepEqual(executed.at(-1)[1].response, { restored: true });
    context.project = "two";
    assert.deepEqual(getRequestHistory(context), []);
    context.project = "one";
    for (let i = 0; i < 205; i++) {
      recordRequestHistory(context, sent);
    }
    assert.equal(getRequestHistory(context).length, 200);
    await commands.get("okapi.tree.filter")();
    assert.equal(requests.getChildren()[0].data.target_id, "folder");
    assert.equal(
      requests.getChildren(requests.getChildren()[0])[0].data.target_id,
      "nested",
    );
  } finally {
    delete globalThis.__okapiNativeMocks;
  }
});
