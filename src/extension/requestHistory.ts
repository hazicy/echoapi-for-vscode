import type * as vscode from "vscode";
import { snowflakeId } from "apipost-tools";
import { cloneDeep, omit } from "lodash";
import { getDataFromGlobalStorage, setDataToGlobalStorage } from "./db";
import { getApiListName } from "./utils";
import type { ApiDetailsData } from "@/features/requests/types/api";

export interface RequestHistoryEntry {
  id: string;
  sentAt: number;
  request: Omit<ApiDetailsData, "response">;
}

const HISTORY_LIMIT = 200;

export function getRequestHistory(
  context: vscode.ExtensionContext,
): RequestHistoryEntry[] {
  const data = getDataFromGlobalStorage(
    context,
    `${getApiListName(context)}:history`,
    [],
  );
  return Array.isArray(data) ? data : [];
}

// Keep request definitions, without response bodies, scoped to the active workspace.
export function recordRequestHistory(
  context: vscode.ExtensionContext,
  data: ApiDetailsData,
) {
  if (!data?.target_id || !data.target_type) {
    return;
  }
  const request = cloneDeep(omit(data, ["response"]));
  const entry: RequestHistoryEntry = {
    id: snowflakeId(),
    sentAt: Date.now(),
    request,
  };
  setDataToGlobalStorage(
    context,
    `${getApiListName(context)}:history`,
    [entry, ...getRequestHistory(context)].slice(0, HISTORY_LIMIT),
  );
}
