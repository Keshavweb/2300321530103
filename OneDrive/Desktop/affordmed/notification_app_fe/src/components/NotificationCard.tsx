import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import { Notification } from "../api/notificationsApi";
import Log from "../utils/logger";
 
interface Props { notification: Notification; isRead: boolean; onRead: (id: string) => void; }
 
const typeColor: any = { Placement: "error", Result: "warning", Event: "info" };
const typeIcon: any = { Placement: <WorkIcon fontSize="small"/>, Result: <SchoolIcon fontSize="small"/>, Event: <EventIcon fontSize="small"/> };
 
const NotificationCard: React.FC<Props> = ({ notification, isRead, onRead }) => {
  const handleClick = () => { if (!isRead) { Log("frontend","debug","component",`Clicked notification ${notification.ID}`); onRead(notification.ID); } };
  return (
    <Card onClick={handleClick} sx={{ mb:1.5, cursor: isRead?"default":"pointer", borderLeft: isRead?"4px solid #e0e0e0":"4px solid #1976d2", backgroundColor: isRead?"#fafafa":"#fff", "&:hover":{ boxShadow: isRead?1:4 } }}>
      <CardContent sx={{ py:1.5, "&:last-child":{ pb:1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <NotificationsIcon color={isRead?"disabled":"primary"} fontSize="small"/>
            <Box>
              <Typography variant="body1" fontWeight={isRead?400:600} color={isRead?"text.secondary":"text.primary"}>{notification.Message}</Typography>
              <Typography variant="caption" color="text.disabled">{new Date(notification.Timestamp).toLocaleString()}</Typography>
            </Box>
          </Box>
          <Chip icon={typeIcon[notification.Type]} label={notification.Type} color={typeColor[notification.Type]||"default"} size="small" variant={isRead?"outlined":"filled"}/>
        </Box>
      </CardContent>
    </Card>
  );
};
export default NotificationCard;
