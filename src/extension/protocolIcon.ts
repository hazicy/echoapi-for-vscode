import * as vscode from "vscode";

const protocolIcons = new Set([
  "api", "sse", "graphql", "websocket2", "socketio", "grpc",
  "socket", "socket_method", "folder", "doc",
]);

/** Shared custom SVG icons for native request trees and editor tabs. */
export function getProtocolIcon(
  context: vscode.ExtensionContext,
  data: { target_type?: string },
): { light: vscode.Uri; dark: vscode.Uri } | undefined {
  const type = data.target_type || "";
  if (!protocolIcons.has(type)) return undefined;
  const name = type === "api" ? "http" : type;
  return {
    light: vscode.Uri.joinPath(context.extensionUri, "dist", "images", `${name}.svg`),
    dark: vscode.Uri.joinPath(context.extensionUri, "dist", "images", `${name}-dark.svg`),
  };
}
