import { isNumber } from 'lodash';

type VersionedApi = {
  target_id: string;
  target_type: string;
  parent_id: string;
  version: number;
};

const conflictTypes = new Set(['api', 'sse', 'websocket2', 'socketio', 'folder', 'graphql']);

export const findApiConflicts = <T extends VersionedApi>(
  selected: T[],
  cloud: Array<{ target_id: string; version: number }>,
  recordedVersions: Record<string, unknown>,
): T[] => {
  // Preserve "any newer cloud row" semantics even if a response repeats an ID.
  const cloudVersions = new Map<string, number>();
  for (const item of cloud) {
    const version = Number(item.version);
    if (version > (cloudVersions.get(item.target_id) ?? -Infinity)) {
      cloudVersions.set(item.target_id, version);
    }
  }
  return selected.filter(item => {
    const recorded = recordedVersions[item.target_id];
    const baseline = isNumber(recorded) ? recorded : item.version;
    const cloudVersion = cloudVersions.get(item.target_id);
    return conflictTypes.has(item.target_type) && cloudVersion !== undefined && cloudVersion > baseline;
  }).map(item => ({ ...item, parent_id: '0' }))
    .sort((a, b) => Number(b.target_type === 'folder') - Number(a.target_type === 'folder'));
};

/** Mutate the caller's upload snapshot; ignore response IDs that are no longer local. */
export const applyApiVersions = <T extends { target_id: string; version: number }>(
  local: T[],
  uploaded: Array<{ target_id: string; version?: unknown }>,
): boolean => {
  const localById = new Map<string, T>();
  for (const item of local) {
    if (!localById.has(item.target_id)) {
      localById.set(item.target_id, item);
    }
  }
  let matched = false;
  for (const item of uploaded) {
    const saved = localById.get(item.target_id);
    if (saved && isNumber(item.version)) {
      saved.version = item.version;
      matched = true;
    }
  }
  return matched;
};
