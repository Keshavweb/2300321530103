import Log from "../utils/logger";
const BASE_URL = "/api/evaluation-service";

export interface Notification {
  ID: string; Type: "Event"|"Result"|"Placement"; Message: string; Timestamp: string;
}

export async function fetchNotifications(token: string, params?: { limit?: number; page?: number; notification_type?: string }): Promise<Notification[]> {
  Log("frontend", "info", "api", `Fetching notifications: ${JSON.stringify(params)}`);
  
  let url = `${BASE_URL}/notifications?`;
  if (params?.limit) url += `limit=${params.limit}&`;
  if (params?.page) url += `page=${params.page}&`;
  if (params?.notification_type && params.notification_type !== "All") url += `notification_type=${params.notification_type}&`;

  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) { Log("frontend","error","api",`Fetch failed: ${response.status}`); throw new Error(`Fetch failed`); }
  const data = await response.json();
  Log("frontend", "info", "api", `Fetched ${data.notifications.length} notifications`);
  return data.notifications;
}

export function getTypeWeight(type: string): number {
  return type === "Placement" ? 3 : type === "Result" ? 2 : 1;
}

export function getPriorityScore(n: Notification): number {
  return getTypeWeight(n.Type) * 1_000_000_000 + new Date(n.Timestamp).getTime() / 1000;
}

export function getTopNNotifications(notifications: Notification[], n: number): Notification[] {
  return [...notifications].sort((a, b) => getPriorityScore(b) - getPriorityScore(a)).slice(0, n);
}
