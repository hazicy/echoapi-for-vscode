import { EventEmitter } from "vscode";
import type { ApiDetailsData } from "@/features/requests/types/api";

export const requestStatusChanged = new EventEmitter<void>();
type Result = { badge: string; color: string; message: string };
const workspaces = new Map<
  string,
  Map<string, { draft?: ApiDetailsData; result?: Result }>
>();
const entry = (workspace: string, id: string) => {
  let items = workspaces.get(workspace);
  if (!items) {
    workspaces.set(workspace, (items = new Map()));
  }
  let state = items.get(id);
  if (!state) {
    items.set(id, (state = {}));
  }
  return state;
};
export function setRequestDraft(
  workspace: string,
  id: string,
  draft?: ApiDetailsData,
) {
  entry(workspace, id).draft = draft;
  requestStatusChanged.fire();
}
export function setRequestResult(
  workspace: string,
  id: string,
  response: any,
  error?: any,
) {
  const message = String(error?.message || error?.code || error || "");
  const timeout = /timeout|timed\s*out|ETIMEDOUT|超时/i.test(message);
  const code = Number(response?.code);
  const failed = !!error || !code || code >= 400;
  entry(workspace, id).result = {
    badge: timeout ? "T" : failed ? "!" : "✓",
    color: timeout
      ? "list.warningForeground"
      : failed
        ? "list.errorForeground"
        : "testing.iconPassed",
    message: timeout
      ? `请求超时 / Request timed out: ${message}`
      : failed
        ? `请求失败 / Request failed: ${message || code || "No response"}`
        : `请求成功 / Request succeeded: HTTP ${code}`,
  };
  requestStatusChanged.fire();
}

/** Evaluate only executable request fields; response examples and documentation are excluded. */
export function requestDecoration(
  workspace: string,
  saved: ApiDetailsData,
  config: any,
  rows: ApiDetailsData[],
) {
  if (
    !["api", "graphql", "sse", "websocket2", "socketio"].includes(
      saved.target_type,
    )
  ) {
    return;
  }
  const state = workspaces.get(workspace)?.get(saved.target_id);
  const data = state?.draft || saved;
  const errors: string[] = [];
  const fields: string[] = [data.url || ""];
  const env = config?.envList?.find(
    (item: any) => item.env_id === config.envDetailKeys,
  );
  const variables = { ...config?.globalVars, ...env?.env_var_list };
  let serverId = config?.serverList?.find(
    (item: any) => item.is_default === 1,
  )?.server_id;
  const ancestors: any[] = [];
  const seen = new Set<string>();
  let current: any = data;
  while (current && !seen.has(current.target_id)) {
    seen.add(current.target_id);
    ancestors.push(current);
    current = rows.find((row) => row.target_id === current.parent_id);
  }
  serverId =
    ancestors.find((row) => row.server_id && row.server_id !== "0")
      ?.server_id || serverId;
  const base =
    env?.server_list?.find((item: any) => item.server_id === serverId)?.uri ||
    "";
  fields.push(base);
  if (!data.url?.trim() && !base.trim()) {
    errors.push("缺少 URL / Missing URL");
  }
  for (const request of [
    config?.globalParams,
    ...ancestors.map((row) => row.request),
  ]) {
    if (!request) {
      continue;
    }
    for (const section of ["header", "query", "cookie", "restful", "body"]) {
      if (
        section === "body" &&
        request.body?.mode &&
        !["form-data", "urlencoded"].includes(request.body.mode)
      ) {
        continue;
      }
      for (const parameter of request[section]?.parameter || []) {
        if (parameter.is_checked === -1) {
          continue;
        }
        if (!parameter.key && !parameter.value) {
          continue;
        } // Editor's empty placeholder row.
        if (!String(parameter.key || "").trim()) {
          errors.push("参数名为空 / Empty parameter name");
        }
        fields.push(String(parameter.key || ""), String(parameter.value ?? ""));
      }
    }
    if (
      request.body?.raw &&
      !["none", "binary", "form-data", "urlencoded"].includes(request.body.mode)
    ) {
      fields.push(request.body.raw);
    }
    if (
      request === data.request &&
      request.body?.mode === "json" &&
      request.body.raw?.trim() &&
      !request.body.raw.includes("{{")
    ) {
      try {
        JSON.parse(request.body.raw);
      } catch {
        errors.push("JSON 请求体格式错误 / Invalid JSON body");
      }
    }
    if (request.auth) {
      fields.push(JSON.stringify(request.auth));
    }
  }
  const missing = new Set<string>();
  const checked = new Set<string>();
  const inspect = (value: string) => {
    for (const match of value.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/g)) {
      const name = match[1].split("|")[0].trim();
      if (/^[$@'"]/.test(name) || checked.has(name)) {
        continue;
      }
      checked.add(name);
      const variable = variables[name];
      const resolved = variable?.current_value ?? variable?.value;
      if (resolved === undefined || resolved === null) {
        missing.add(name);
      } else {
        inspect(String(resolved));
      }
    }
  };
  fields.forEach(inspect);
  const statuses: Result[] = [];
  if (errors.length) {
    statuses.push({
      badge: "!",
      color: "list.errorForeground",
      message: [...new Set(errors)].join("\n"),
    });
  }
  if (missing.size) {
    statuses.push({
      badge: "E",
      color: "list.warningForeground",
      message: `缺少变量 / Missing variables: ${[...missing].join(", ")}`,
    });
  }
  if (state?.draft) {
    statuses.push({
      badge: "M",
      color: "list.warningForeground",
      message: "有未保存的修改 / Unsaved changes",
    });
  }
  if (state?.result) {
    statuses.push(state.result);
  }
  if (!statuses.length) {
    return;
  }
  return {
    badge: statuses[0].badge,
    color: statuses[0].color,
    tooltip: statuses.map((status) => status.message).join("\n"),
  };
}
