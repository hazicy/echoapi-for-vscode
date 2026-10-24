import type { ApiDetailsData } from "@/features/requests/types/api";
import type { TestingReportList } from "@/features/testing/types/res";
import type { RequestHistoryEntry } from "./requestHistory";

export type Section = "requests" | "tests" | "history";
export type TreeNode =
  | { kind: "request"; data: ApiDetailsData }
  | { kind: "testFolder"; data: ApiDetailsData }
  | { kind: "reports" }
  | { kind: "report"; data: TestingReportList }
  | { kind: "day"; day: string }
  | { kind: "history"; data: RequestHistoryEntry }
  | { kind: "empty"; label: string; id: string };

export function dayKey(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Count descendants, excluding containers, without looping on malformed ancestry. */
export function countFolderRequests(
  all: ApiDetailsData[],
  folderId: string,
): number {
  const children = new Map<string, ApiDetailsData[]>();
  for (const item of all) {
    const parent = String(item.parent_id);
    const siblings = children.get(parent) || [];
    siblings.push(item);
    children.set(parent, siblings);
  }
  const pending = [String(folderId)];
  const visited = new Set(pending);
  let count = 0;
  while (pending.length) {
    for (const item of children.get(pending.pop()!) || []) {
      const id = String(item.target_id);
      if (visited.has(id)) {continue;}
      visited.add(id);
      if (!["folder", "socket", "sample_group"].includes(item.target_type))
        {count++;}
      pending.push(id);
    }
  }
  return count;
}

/** Preserve matching requests and their ancestors while keeping root ordering stable. */
export function requestChildren(
  all: ApiDetailsData[],
  parent?: ApiDetailsData,
  filter = "",
  foldersOnly = false,
): ApiDetailsData[] {
  const byId = new Map(all.map((item) => [String(item.target_id), item]));
  const visible = new Set<string>();
  if (filter) {
    for (const item of all) {
      if (
        !`${item.name} ${item.url || ""} ${item.method || ""}`
          .toLowerCase()
          .includes(filter)
      ) {
        continue;
      }
      let current: ApiDetailsData | undefined = item;
      const visited = new Set<string>();
      while (current && !visited.has(String(current.target_id))) {
        const id = String(current.target_id);
        visited.add(id);
        visible.add(id);
        current = byId.get(String(current.parent_id));
      }
    }
  }
  return all
    .filter((item) => {
      if (foldersOnly && item.target_type !== "folder") {
        return false;
      }
      if (filter && !visible.has(String(item.target_id))) {
        return false;
      }
      return parent
        ? String(item.parent_id) === String(parent.target_id)
        : !item.parent_id ||
            String(item.parent_id) === "0" ||
            !byId.has(String(item.parent_id));
    })
    .sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));
}
