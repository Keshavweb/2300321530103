import Log from "../utils/logger";
const KEY = "read_notifications";
export function getReadIds(): Set<string> {
  try { const s = localStorage.getItem(KEY); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
}
export function markAsRead(id: string): void {
  const ids = getReadIds(); ids.add(id);
  localStorage.setItem(KEY, JSON.stringify([...ids]));
  Log("frontend", "debug", "state", `Notification ${id} marked as read`);
}
export function markAllAsRead(ids: string[]): void {
  const r = getReadIds(); ids.forEach(id => r.add(id));
  localStorage.setItem(KEY, JSON.stringify([...r]));
  Log("frontend", "info", "state", `Marked ${ids.length} notifications as read`);
}
export function isRead(id: string): boolean { return getReadIds().has(id); }
