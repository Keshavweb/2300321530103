import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Button, Chip, Stack, Divider, Paper } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getTopNNotifications, Notification } from "../api/notificationsApi";
import { getReadIds, markAsRead } from "../state/readState";
import NotificationCard from "../components/NotificationCard";
import Log from "../utils/logger";

const BASE_URL = "/api/evaluation-service";

const PriorityInboxPage: React.FC<{ token: string|null }> = ({ token }) => {
  const [topN, setTopN] = useState(10);
  const [prioritized, setPrioritized] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds());

  const load = async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const response = await fetch(`${BASE_URL}/notifications?limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      const top = getTopNNotifications(data.notifications, topN);
      setPrioritized(top);
      setReadIds(getReadIds());
      Log("frontend","info","state",`Priority inbox: top ${topN} computed`);
    } catch (err) {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token, topN]); // eslint-disable-line

  const handleRead = (id: string) => { markAsRead(id); setReadIds(new Set(getReadIds())); };
  const unread = prioritized.filter(n => !readIds.has(n.ID)).length;

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <StarIcon color="warning"/>
          <Box>
            <Typography variant="h5" fontWeight={700}>Priority Inbox</Typography>
            {unread > 0 && <Typography variant="caption" color="primary">{unread} unread</Typography>}
          </Box>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth:100 }}>
            <InputLabel>Show top</InputLabel>
            <Select value={topN} label="Show top" onChange={e => setTopN(Number(e.target.value))}>
              {[10,15,20].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
            </Select>
          </FormControl>
          <Button size="small" startIcon={<RefreshIcon/>} onClick={load} disabled={loading}>Refresh</Button>
        </Stack>
      </Box>
      {!loading && prioritized.length > 0 && (
        <Paper variant="outlined" sx={{ p:1.5, mb:2, borderRadius:2 }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>Priority: Placement &gt; Result &gt; Event + recency</Typography>
          <Stack direction="row" spacing={1}>
            <Chip label={`${prioritized.filter(n=>n.Type==="Placement").length} Placement`} color="error" size="small"/>
            <Chip label={`${prioritized.filter(n=>n.Type==="Result").length} Result`} color="warning" size="small"/>
            <Chip label={`${prioritized.filter(n=>n.Type==="Event").length} Event`} color="info" size="small"/>
          </Stack>
        </Paper>
      )}
      <Divider sx={{ mb:2 }}/>
      {loading && <Box display="flex" justifyContent="center" py={4}><CircularProgress/></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && prioritized.length===0 && <Alert severity="info">No notifications found.</Alert>}
      {!loading && prioritized.map((n, i) => (
        <Box key={n.ID} sx={{ position:"relative" }}>
          <Typography variant="caption" sx={{ position:"absolute", top:8, right:8, zIndex:1, background:"#f5f5f5", borderRadius:1, px:0.5, color:"text.disabled" }}>#{i+1}</Typography>
          <NotificationCard notification={n} isRead={readIds.has(n.ID)} onRead={handleRead}/>
        </Box>
      ))}
    </Box>
  );
};
export default PriorityInboxPage;