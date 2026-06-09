import { useState, useEffect, useCallback } from "react";
import { fetchNotifications, Notification } from "../api/notificationsApi";
import { getReadIds, markAsRead } from "../state/readState";
import Log from "../utils/logger";
 
export function useNotifications({ token, limit=10, page=1, notificationType }: { token:string|null; limit?:number; page?:number; notificationType?:string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds());
 
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    Log("frontend","info","hook",`Loading notifications page ${page}`);
    try {
      const data = await fetchNotifications(token, { limit, page, notification_type: notificationType });
      setNotifications(data); setReadIds(getReadIds());
    } catch { setError("Failed to load notifications."); }
    finally { setLoading(false); }
  }, [token, limit, page, notificationType]);
 
  useEffect(() => { load(); }, [load]);
 
  const handleMarkAsRead = (id: string) => { markAsRead(id); setReadIds(new Set(getReadIds())); };
  return { notifications, loading, error, readIds, reload: load, handleMarkAsRead };
}
