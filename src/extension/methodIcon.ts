import * as vscode from "vscode";

const httpMethods = new Set([
  "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS",
]);

export function getMethodIcon(
  context: vscode.ExtensionContext,
  data: { target_type?: string; method?: string },
): { light: vscode.Uri; dark: vscode.Uri } | undefined {
  const method = String(data.method || "").toUpperCase();
  if (data.target_type !== "api" || !httpMethods.has(method)) return undefined;
  const name = method.toLowerCase();
  return {
    light: vscode.Uri.joinPath(context.extensionUri, "dist", "images", "methods", `${name}-letter-light.svg`),
    dark: vscode.Uri.joinPath(context.extensionUri, "dist", "images", "methods", `${name}-letter.svg`),
  };
}
