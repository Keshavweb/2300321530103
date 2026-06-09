import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Pagination, Button, Stack, Divider } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNotifications } from "../hooks/useNotifications";
import { markAllAsRead, getReadIds } from "../state/readState";
import NotificationCard from "../components/NotificationCard";
import Log from "../utils/logger";
 
const TYPES = ["All","Placement","Result","Event"];
 
const AllNotificationsPage: React.FC<{ token: string|null }> = ({ token }) => {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds());
  const { notifications, loading, error, reload, handleMarkAsRead } = useNotifications({ token, limit:10, page, notificationType: filter==="All"?undefined:filter });
 
  useEffect(() => { Log("frontend","info","page","All Notifications page loaded"); }, []);
 
  const handleRead = (id: string) => { handleMarkAsRead(id); setReadIds(new Set(getReadIds())); };
  const unread = notifications.filter(n => !readIds.has(n.ID)).length;
 
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
        <Box>
          <Typography variant="h5" fontWeight={700}>All Notifications</Typography>
          {unread > 0 && <Typography variant="caption" color="primary">{unread} unread</Typography>}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button size="small" startIcon={<DoneAllIcon/>} onClick={() => { markAllAsRead(notifications.map(n=>n.ID)); setReadIds(new Set(getReadIds())); }} disabled={unread===0}>Mark all read</Button>
          <Button size="small" startIcon={<RefreshIcon/>} onClick={reload} disabled={loading}>Refresh</Button>
        </Stack>
      </Box>
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        {TYPES.map(t => <Button key={t} variant={filter===t?"contained":"outlined"} size="small" onClick={() => { setFilter(t); setPage(1); Log("frontend","info","page",`Filter: ${t}`); }} color={t==="Placement"?"error":t==="Result"?"warning":t==="Event"?"info":"primary"}>{t}</Button>)}
      </Stack>
      <Divider sx={{ mb:2 }}/>
      {loading && <Box display="flex" justifyContent="center" py={4}><CircularProgress/></Box>}
      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
      {!loading && !error && notifications.length===0 && <Alert severity="info">No notifications found.</Alert>}
      {!loading && notifications.map(n => <NotificationCard key={n.ID} notification={n} isRead={readIds.has(n.ID)} onRead={handleRead}/>)}
      {!loading && notifications.length>0 && <Box display="flex" justifyContent="center" mt={3}><Pagination count={10} page={page} onChange={(_,v) => { setPage(v); Log("frontend","info","page",`Page ${v}`); }} color="primary"/></Box>}
    </Box>
  );
};
export default AllNotificationsPage;
