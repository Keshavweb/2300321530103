import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Box, Button, CircularProgress, Alert, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getAuthToken } from "./auth/authService";
import { initLogger } from "./utils/logger";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import PriorityInboxPage from "./pages/PriorityInboxPage";

const theme = createTheme({
  palette: { primary: { main: "#1565c0" }, secondary: { main: "#f57c00" } },
  typography: { fontFamily: '"Inter","Roboto","Arial",sans-serif' }
});

function NavBar() {
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const navItems = [
    { label: "All Notifications", path: "/", icon: <NotificationsIcon fontSize="small"/> },
    { label: "Priority Inbox", path: "/priority", icon: <StarIcon fontSize="small"/> }
  ];
  return (
    <AppBar position="sticky">
      <Toolbar>
        <NotificationsIcon sx={{ mr:1 }}/>
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow:1 }}>Campus Notifications</Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setOpen(true)}><MenuIcon/></IconButton>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
              <List sx={{ width:220 }}>
                {navItems.map(item => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton component={Link} to={item.path} selected={location.pathname===item.path} onClick={() => setOpen(false)}>
                      <ListItemText primary={item.label}/>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          <Box display="flex" gap={1}>
            {navItems.map(item => (
              <Button key={item.path} component={Link} to={item.path} color="inherit" startIcon={item.icon} variant={location.pathname===item.path?"outlined":"text"} sx={{ borderColor:"rgba(255,255,255,0.5)" }}>
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [token, setToken] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    getAuthToken()
      .then(t => {
        initLogger(t);
        setToken(t);
      })
      .catch(() => setError("Failed to connect to server."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <ThemeProvider theme={theme}><CssBaseline/>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" gap={2}>
        <CircularProgress/>
        <Typography color="text.secondary">Connecting...</Typography>
      </Box>
    </ThemeProvider>
  );

  if (error) return (
    <ThemeProvider theme={theme}><CssBaseline/>
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh" p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    </ThemeProvider>
  );

  return (
    <ThemeProvider theme={theme}><CssBaseline/>
      <BrowserRouter>
        <NavBar/>
        <Container maxWidth="md" sx={{ py:3 }}>
          <Routes>
            <Route path="/" element={<AllNotificationsPage token={token}/>}/>
            <Route path="/priority" element={<PriorityInboxPage token={token}/>}/>
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
