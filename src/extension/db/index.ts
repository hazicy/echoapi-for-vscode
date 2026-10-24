import type * as vscode from "vscode";
import path from "path";
import fs from "fs";
import os from "os";
import { randomUUID } from "crypto";
import { storageChanged } from "../storageEvents";

export const isWin = () => os.platform() === "win32";

const storagePaths = (context: vscode.ExtensionContext, key: string) => {
  const platform = os.platform();
  // macOS releases historically used the Windows cache name. Keep that name
  // authoritative so correcting platform detection does not hide existing data.
  const cacheKey =
    platform === "win32" || platform === "darwin"
      ? key.replace(/:/g, "_")
      : key;
  const cacheDirectory = path.join(os.homedir(), "echoapi_for_vscode");
  const cache = path.join(cacheDirectory, `${cacheKey}.json`);
  const extension = path.join(
    context.globalStorageUri.fsPath,
    `${isWin() ? cacheKey : key}.json`,
  );
  const candidates = [
    ...new Set([
      cache,
      path.join(cacheDirectory, `${key}.json`),
      extension,
      path.join(context.globalStorageUri.fsPath, `${key}.json`),
    ]),
  ];
  return { cache, extension, candidates };
};

/** Use the same path precedence for existence checks and opening the data file. */
export const getStorageFilePath = (
  context: vscode.ExtensionContext,
  key: string,
) => {
  const { cache, candidates } = storagePaths(context, key);
  return candidates.find((candidate) => fs.existsSync(candidate)) || cache;
};

export const existFileSync = (
  context: vscode.ExtensionContext,
  key: string,
) => {
  try {
    return storagePaths(context, key).candidates.some((candidate) =>
      fs.existsSync(candidate),
    );
  } catch {
    return false;
  }
};

export const getDataFromGlobalStorage = (
  context: vscode.ExtensionContext,
  key: string,
  defaultValue = {},
) => {
  try {
    for (const candidate of storagePaths(context, key).candidates) {
      try {
        const result = JSON.parse(fs.readFileSync(candidate, "utf-8"));
        // A malformed collection must not mask a valid fallback copy.
        if (Array.isArray(defaultValue) && !Array.isArray(result)) {
          continue;
        }
        return result;
      } catch {
        // Missing, unreadable or damaged files may have a valid fallback copy.
      }
    }
  } catch {
    // Keep callers' defaults when storage is unavailable.
  }
  return defaultValue;
};

const writeAtomically = (filePath: string, data: string) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporaryPath, data, { encoding: "utf-8", flag: "wx" });
    fs.renameSync(temporaryPath, filePath);
  } finally {
    if (fs.existsSync(temporaryPath)) {
      fs.unlinkSync(temporaryPath);
    }
  }
};

export const setDataToGlobalStorage = (
  context: vscode.ExtensionContext,
  key: string,
  value: any,
) => {
  try {
    const { cache, extension } = storagePaths(context, key);
    const data = JSON.stringify(value, null, 2);
    if (data === undefined) {
      return false;
    }
    // The cache is always read first: committing it determines save success.
    writeAtomically(cache, data);
    try {
      writeAtomically(extension, data);
    } catch {
      // A failed mirror must not turn a committed save into a reported failure.
    }
  } catch {
    return false;
  }
  storageChanged.fire(key);
  return true;
};
