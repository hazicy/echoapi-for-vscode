import type { ApiDetailsData } from "@/features/requests/types/api";

type CollectionItem = Pick<
  ApiDetailsData,
  "target_id" | "parent_id" | "target_type" | "sort"
>;

const indexChildren = <T extends CollectionItem>(items: T[]) => {
  const children = new Map<string, T[]>();
  for (const item of items) {
    const siblings = children.get(item.parent_id);
    if (siblings) {
      siblings.push(item);
    } else {
      children.set(item.parent_id, [item]);
    }
  }
  return children;
};

/** Include the selected item, then its descendants in the original collection order. */
export const getCollectionChildIds = <T extends CollectionItem>(
  items: T[],
  root: T,
): string[] => {
  const children = indexChildren(items);
  const visited = new Set<string>();
  const result: string[] = [];
  const pending = [root];
  while (pending.length > 0) {
    const item = pending.pop()!;
    if (visited.has(item.target_id)) {
      continue;
    }
    visited.add(item.target_id);
    result.push(item.target_id);
    if (item === root || item.target_type === "folder") {
      const descendants = children.get(item.target_id) || [];
      for (let index = descendants.length - 1; index >= 0; index--) {
        pending.push(descendants[index]);
      }
    }
  }
  return result;
};

/** Test runs use sorted APIs in each folder before visiting its sorted subfolders. */
export const getCollectionApis = <T extends CollectionItem>(
  items: T[],
  folderId: string,
): T[] => {
  const children = indexChildren(items);
  const visited = new Set<string>();
  const result: T[] = [];
  const pending = [folderId];
  while (pending.length > 0) {
    const id = pending.pop()!;
    if (visited.has(id)) {
      continue;
    }
    visited.add(id);
    const siblings = (children.get(id) || []).sort((a, b) => a.sort - b.sort);
    for (const item of siblings) {
      if (item.target_type === "api") {
        result.push(item);
      }
    }
    for (let index = siblings.length - 1; index >= 0; index--) {
      if (siblings[index].target_type === "folder") {
        pending.push(siblings[index].target_id);
      }
    }
  }
  return result;
};
