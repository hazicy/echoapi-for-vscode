import * as vscode from "vscode";

export const protocolThemeIcons: Record<string, string> = {
  api: "globe",
  sse: "broadcast",
  graphql: "type-hierarchy",
  websocket2: "debug-disconnect",
  socketio: "plug",
  grpc: "server-process",
  socket: "plug",
  socket_method: "symbol-method",
  folder: "folder",
  doc: "file-text",
};

/** Webview editor tabs accept URI icons, so supply monochrome theme variants. */
export function getProtocolIcon(
  context: vscode.ExtensionContext,
  data: { target_type?: string },
): { light: vscode.Uri; dark: vscode.Uri } | undefined {
  const type = data.target_type || "";
  if (!protocolThemeIcons[type]) return undefined;
  const name = type === "api" ? "http" : type;
  return {
    light: vscode.Uri.joinPath(context.extensionUri, "dist", "images", `${name}.svg`),
    dark: vscode.Uri.joinPath(context.extensionUri, "dist", "images", `${name}-dark.svg`),
  };
}
