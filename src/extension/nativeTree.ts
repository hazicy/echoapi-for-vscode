import { copyAsCurl } from "./apis";
import { protocolThemeIcons } from "./protocolIcon";
import * as vscode from "vscode";
import { snowflakeId } from "apipost-tools";
import { cloneDeep } from "lodash";
import { getApiList, getApiListName, getProjectReportList } from "./utils";
import { getRequestHistory } from "./requestHistory";
import { storageChanged } from "./storageEvents";
import {
  dayKey,
  requestChildren,
  type Section,
  type TreeNode,
} from "./nativeTreeData";
import { handleMessage } from "./messageHandler/sidbar";
import { APIS_BASE_DEFAULT_DATA } from "@/features/requests/constants/common";
import { APIS_TARGET_TYPE_ENUM } from "@/features/requests/constants";
import type { ApiDetailsData } from "@/features/requests/types/api";

export function registerNativeTree(context: vscode.ExtensionContext) {
  const changed = new vscode.EventEmitter<TreeNode | undefined>();
  const zh = vscode.env.language.startsWith("zh");
  let filter = "";
  const list = (): ApiDetailsData[] =>
    getApiList(context).filter(
      (item: ApiDetailsData) => !item.is_deleted || item.is_deleted === -1,
    );
  const matches = (data: Pick<ApiDetailsData, "name" | "url" | "method">) =>
    `${data.name} ${data.url || ""} ${data.method || ""}`
      .toLowerCase()
      .includes(filter);
  const history = () =>
    getRequestHistory(context).filter((entry) => matches(entry.request));
  const children = (parent?: ApiDetailsData, foldersOnly = false) =>
    requestChildren(list(), parent, foldersOnly ? "" : filter, foldersOnly);
  const empty = (label: string, id: string): TreeNode[] => [
    { kind: "empty", label, id },
  ];
  const requestItem = (
    data: Pick<
      ApiDetailsData,
      "name" | "url" | "method" | "target_id" | "target_type"
    >,
    prefix: string,
  ) => {
    const folder = data.target_type === "folder";
    const item = new vscode.TreeItem(
      data.name || "",
      folder
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None,
    );
    item.id = `${prefix}:${data.target_id}`;
    item.contextValue = folder ? "okapiFolder"
      : ["api", "graphql"].includes(data.target_type) ? "okapiRequestHttp" : "okapiRequest";
    const protocolLabels: Record<string, string> = {
      sse: "SSE",
      graphql: "GraphQL",
      websocket2: "WebSocket",
      socketio: "Socket.IO",
      grpc: "gRPC",
    };
    const requestLabel = protocolLabels[data.target_type] ||
      String(data.method || data.target_type).toUpperCase();
    item.description = folder
      ? undefined
      : requestLabel;
    item.iconPath = new vscode.ThemeIcon(protocolThemeIcons[data.target_type] || "globe");
    item.tooltip = [data.name, folder ? undefined : requestLabel, data.url].filter(Boolean).join(" ");
    return item;
  };
  const provider = (section: Section): vscode.TreeDataProvider<TreeNode> => ({
    onDidChangeTreeData: changed.event,
    getTreeItem(node) {
      switch (node.kind) {
        case "request": {
          const item = requestItem(node.data, "request");
          if (node.data.target_type !== "folder") {
            item.command = {
              command: "okapi.tree.open",
              title: "Open Request",
              arguments: [node],
            };
          }
          return item;
        }
        case "testFolder": {
          const item = requestItem(node.data, "test");
          item.collapsibleState = children(node.data, true).length
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None;
          item.contextValue = "okapiTestFolder";
          item.iconPath = new vscode.ThemeIcon("beaker");
          item.command = {
            command: "okapi.tree.runTests",
            title: "Open Tests",
            arguments: [node],
          };
          item.tooltip = zh
            ? `${node.data.name}：打开测试配置与运行页面`
            : `${node.data.name}: open test configuration and runner`;
          return item;
        }
        case "reports": {
          const item = new vscode.TreeItem(
            zh ? "测试报告" : "Test Reports",
            vscode.TreeItemCollapsibleState.Collapsed,
          );
          item.id = "test-reports";
          item.iconPath = new vscode.ThemeIcon("checklist");
          item.description = String(getProjectReportList(context).length);
          return item;
        }
        case "report": {
          const item = new vscode.TreeItem(
            node.data.report_name || (zh ? "测试报告" : "Test Report"),
          );
          item.id = `report:${node.data.report_id}`;
          item.contextValue = "okapiReport";
          const http = node.data.complete?.http;
          item.iconPath = new vscode.ThemeIcon(
            http?.success === http?.total ? "pass" : "error",
            new vscode.ThemeColor(
              http?.success === http?.total
                ? "testing.iconPassed"
                : "testing.iconFailed",
            ),
          );
          item.description = node.data.complete?.start_at
            ? new Date(node.data.complete.start_at).toLocaleString()
            : undefined;
          item.command = {
            command: "okapi.tree.openReport",
            title: "Open Report",
            arguments: [node],
          };
          return item;
        }
        case "day": {
          const item = new vscode.TreeItem(
            node.day,
            vscode.TreeItemCollapsibleState.Expanded,
          );
          item.id = `history-day:${node.day}`;
          item.iconPath = new vscode.ThemeIcon("calendar");
          item.description = String(
            history().filter((entry) => dayKey(entry.sentAt) === node.day)
              .length,
          );
          return item;
        }
        case "history": {
          const item = requestItem(node.data.request, "history");
          item.id = `history:${node.data.id}`;
          item.collapsibleState = vscode.TreeItemCollapsibleState.None;
          item.contextValue = "okapiHistory";
          item.description = `${item.description} · ${new Date(node.data.sentAt).toLocaleTimeString()}`;
          item.tooltip = `${item.tooltip}\n${new Date(node.data.sentAt).toLocaleString()}`;
          item.command = {
            command: "okapi.tree.openHistory",
            title: "Open Historical Request",
            arguments: [node],
          };
          return item;
        }
        case "empty": {
          const item = new vscode.TreeItem(node.label);
          item.id = node.id;
          item.iconPath = new vscode.ThemeIcon("info");
          return item;
        }
      }
    },
    getChildren(node): TreeNode[] {
      if (!node) {
        if (section === "requests") {
          const rows = children().map((data) => ({
            kind: "request" as const,
            data,
          }));
          return rows.length
            ? rows
            : empty(
                zh
                  ? "暂无接口，点击 + 新建"
                  : "No requests. Use + to create one.",
                "empty:requests",
              );
        }
        if (section === "tests") {
          return [
            ...children(undefined, true).map((data) => ({
              kind: "testFolder" as const,
              data,
            })),
            { kind: "reports" },
          ];
        }
        const days = [
          ...new Set(history().map((entry) => dayKey(entry.sentAt))),
        ];
        return days.length
          ? days.map((day) => ({ kind: "day", day }))
          : empty(
              zh ? "发送请求后会显示在这里" : "Sent requests will appear here.",
              "empty:history",
            );
      }
      if (node.kind === "request") {
        return children(node.data).map((data) => ({ kind: "request", data }));
      }
      if (node.kind === "testFolder") {
        return children(node.data, true).map((data) => ({
          kind: "testFolder",
          data,
        }));
      }
      if (node.kind === "reports") {
        const reports = getProjectReportList(context);
        return reports.length
          ? reports.map((data) => ({ kind: "report", data }))
          : empty(
              zh ? "暂无测试报告" : "No test reports yet.",
              "empty:reports",
            );
      }
      if (node.kind === "day") {
        return history()
          .filter((entry) => dayKey(entry.sentAt) === node.day)
          .map((data) => ({ kind: "history", data }));
      }
      return [];
    },
    getParent(node) {
      if (node.kind === "request" || node.kind === "testFolder") {
        const parent = list().find(
          (row) => String(row.target_id) === String(node.data.parent_id),
        );
        return parent ? { kind: node.kind, data: parent } : undefined;
      }
      if (node.kind === "history") {
        return { kind: "day", day: dayKey(node.data.sentAt) };
      }
      if (node.kind === "day") {
        return undefined;
      }
      if (node.kind === "report") {
        return { kind: "reports" };
      }
      return undefined;
    },
  });
  const view = vscode.window.createTreeView("okapiRequests", {
    treeDataProvider: provider("requests"),
    showCollapseAll: true,
  });
  const testsView = vscode.window.createTreeView("okapiTests", {
    treeDataProvider: provider("tests"),
    showCollapseAll: true,
  });
  const historyView = vscode.window.createTreeView("okapiHistory", {
    treeDataProvider: provider("history"),
    showCollapseAll: true,
  });
  context.subscriptions.push(
    view,
    testsView,
    historyView,
    changed,
    storageChanged.event((key) => {
      if (
        key === "apiList" ||
        key.startsWith("apiList:") ||
        key.endsWith(":test") ||
        key === "userConfig"
      ) {
        changed.fire(undefined);
      }
    }),
  );
  const command = (id: string, callback: (...args: any[]) => any) =>
    context.subscriptions.push(vscode.commands.registerCommand(id, callback));
  command("okapi.tree.open", (node: Extract<TreeNode, { kind: "request" }>) =>
    handleMessage(
      { action: "openTagPanelById", data: node.data.target_id },
      context,
    ),
  );
  command(
    "okapi.tree.runTests",
    async (node?: Extract<TreeNode, { kind: "testFolder" }>) => {
      let data = node?.data;
      if (!data) {
        const folders = list().filter((item) => item.target_type === "folder");
        if (!folders.length) {
          await vscode.window.showInformationMessage(
            zh
              ? "请先在接口中创建目录并添加请求。"
              : "Create a request folder and add requests first.",
          );
          return;
        }
        const selected = await vscode.window.showQuickPick(
          folders.map((data) => ({ label: data.name, data })),
          { title: zh ? "选择测试目录" : "Select Test Folder" },
        );
        data = selected?.data;
      }
      if (data) {
        await vscode.commands.executeCommand("echoapi.folderTest", data);
      }
    },
  );
  command(
    "okapi.tree.openReport",
    (node: Extract<TreeNode, { kind: "report" }>) =>
      vscode.commands.executeCommand("echoapi.folderTestReportData", node.data),
  );
  command(
    "okapi.tree.deleteReport",
    (node: Extract<TreeNode, { kind: "report" }>) =>
      handleMessage(
        { action: "deleteReport", data: { report_id: node.data.report_id } },
        context,
      ),
  );
  command(
    "okapi.tree.openHistory",
    (node: Extract<TreeNode, { kind: "history" }>) => {
      const request = node.data.request;
      const data = {
        ...cloneDeep(APIS_BASE_DEFAULT_DATA[request.target_type]),
        ...cloneDeep(request),
        target_id: `history-${node.data.id}`,
        is_create: 1,
        is_changed: 1,
      };
      return vscode.commands.executeCommand("openTabPanel", data);
    },
  );
  const selectedData = (node?: TreeNode) => {
    if (!node || (node.kind !== "request" && node.kind !== "testFolder")) return;
    return list().find((item) => item.target_id === node.data.target_id);
  };
  command("okapi.tree.rename", async (node?: TreeNode) => {
    const data = selectedData(node);
    if (!data) return;
    const projectKey = getApiListName(context);
    const name = await vscode.window.showInputBox({
      title: zh ? "重命名" : "Rename",
      value: data.name,
      validateInput: (value) => value.trim() ? undefined : zh ? "请输入名称" : "Enter a name",
    });
    if (!name?.trim() || name.trim() === data.name || getApiListName(context) !== projectKey) return;
    // Read again after the prompt so concurrent edits are preserved.
    const current = selectedData(node);
    if (!current) return;
    await handleMessage({ action: "saveFolder", data: { ...cloneDeep(current), name: name.trim() } }, context);
    changed.fire(undefined);
  });
  command("okapi.tree.clone", async (node?: TreeNode) => {
    const data = selectedData(node);
    if (!data || data.target_type === "folder") return;
    await handleMessage({ action: "cloneApi", data: { target_id: data.target_id } }, context);
    changed.fire(undefined);
  });
  command("okapi.tree.delete", async (node?: TreeNode) => {
    const data = selectedData(node);
    if (!data) return;
    await handleMessage({ action: "showConfirmation", data: {
      target_id: data.target_id,
      title: zh ? `确定删除“${data.name}”${data.target_type === "folder" ? "及其所有内容" : ""}？`
        : `Delete "${data.name}"${data.target_type === "folder" ? " and all its contents" : ""}?`,
    } }, context);
    changed.fire(undefined);
  });
  command("okapi.tree.copyCurl", async (node?: TreeNode) => {
    const data = selectedData(node);
    if (!data || !["api", "graphql"].includes(data.target_type)) return;
    await copyAsCurl({ ...cloneDeep(data), parent_id: "0" }, context);
  });
  command("okapi.tree.revealStorage", (node?: TreeNode) => {
    if (!selectedData(node)) return;
    return handleMessage({ action: "openVscodeFileExplorer", data: undefined }, context);
  });
  command("okapi.tree.folderSettings", (node?: TreeNode) => {
    const data = selectedData(node);
    if (data?.target_type !== "folder") return;
    return handleMessage({ action: "openTagPanelById", data: data.target_id }, context);
  });
  command("okapi.tree.folderReports", (node?: TreeNode) => {
    const data = selectedData(node);
    if (data?.target_type !== "folder") return;
    return vscode.commands.executeCommand("echoapi.folderTest", data, { openHistoryReport: true });
  });
  command("okapi.tree.refresh", () => changed.fire(undefined));
  command("okapi.tree.filter", async () => {
    const value = await vscode.window.showInputBox({
      title: zh ? "筛选接口和历史" : "Filter Requests and History",
      prompt: zh
        ? "按名称、URL 或方法筛选；清空显示全部"
        : "Filter by name, URL or method; clear to show all",
      value: filter,
    });
    if (value === undefined) {
      return;
    }
    filter = value.trim().toLowerCase();
    view.message = filter ? `${zh ? "筛选" : "Filter"}: ${value}` : undefined;
    historyView.message = view.message;
    changed.fire(undefined);
  });
  for (const type of ["api", "sse", "graphql", "websocket2", "socketio", "folder"]) {
    command(`okapi.tree.new.${type}`, (node?: TreeNode) =>
      vscode.commands.executeCommand("okapi.tree.new", node, type));
  }
  command("okapi.tree.new", async (node?: TreeNode, targetType?: string) => {
    const parent =
      node && (node.kind === "request" || node.kind === "testFolder")
        ? node.data
        : undefined;
    const types = [
      APIS_TARGET_TYPE_ENUM.API,
      APIS_TARGET_TYPE_ENUM.SSE,
      APIS_TARGET_TYPE_ENUM.GRAPHQL,
      APIS_TARGET_TYPE_ENUM.WEBSOCKET2,
      APIS_TARGET_TYPE_ENUM.SOCKETIO,
      APIS_TARGET_TYPE_ENUM.FOLDER,
    ];
    const type = targetType && types.includes(targetType as APIS_TARGET_TYPE_ENUM)
      ? { type: targetType } : await vscode.window.showQuickPick(
      types.map((type) => ({
        label:
          type === "folder" ? (zh ? "目录" : "Folder") : type.toUpperCase(),
        type,
      })),
      { title: zh ? "新建" : "New" },
    );
    if (!type) {
      return;
    }
    const name = await vscode.window.showInputBox({
      title: zh ? "名称" : "Name",
      value:
        type.type === "folder"
          ? zh
            ? "新建目录"
            : "New Folder"
          : zh
            ? "新建接口"
            : "New Request",
      validateInput: (value) =>
        value.trim() ? undefined : zh ? "请输入名称" : "Enter a name",
    });
    if (!name?.trim()) {
      return;
    }
    const data = {
      ...cloneDeep(APIS_BASE_DEFAULT_DATA[type.type]),
      target_type: type.type,
      target_id: snowflakeId(),
      name: name.trim(),
      parent_id: parent?.target_type === "folder" ? parent.target_id : "0",
      is_create: 1,
      is_changed: 1,
      is_deleted: -1,
    } as ApiDetailsData;
    const saved = await handleMessage({ action: "saveFolder", data }, context);
    if (saved === false) {
      return;
    }
    if (type.type !== "folder") {
      await vscode.commands.executeCommand("openTabPanel", data);
    }
    changed.fire(undefined);
  });
}
