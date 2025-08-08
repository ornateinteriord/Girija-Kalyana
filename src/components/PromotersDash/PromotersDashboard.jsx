import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  ListItemIcon,
  Box,
  Avatar,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import {
  Logout,
  Menu as MenuIcon,
  Person,
  ArrowDropDown as ArrowDropDownIcon,
  Settings,
  Lock,
  Notifications,
  Email,
} from "@mui/icons-material";
import sidebarData from "./sidebar/data";
import AdminProfileDialog from "../Adminprofile/AdminProfile";
import Sidebar from "./sidebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import TokenService from "../token/tokenService";

const PromotersDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const openMenu = Boolean(anchorEl);
  const navigation = useNavigate();
  const toggleDrawer = () => setOpen(!open);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileDialogOpen = () => {
    setProfileDialogOpen(true);
    handleMenuClose();
  };

   const handleConfirmLogout = () => {
     
      navigation("/");
      TokenService.removeToken();
      window.dispatchEvent(new Event("storage"));
    };


  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(to right, #182848, #4d75d4)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2, display: { xs: "inline-flex", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            {sidebarData.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
            >
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              sx={{ mr: 2, display: { xs: "none", sm: "inline-flex" } }}
            >
              <Badge badgeContent={3} color="error">
                <Email />
              </Badge>
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                borderRadius: 1,
                p: 0.5,
              }}
              onClick={handleMenuOpen}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#4d75d4",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
                alt="Admin"
              >
                A
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{ ml: 1, mr: 1, fontWeight: "bold" }}
              >
                Admin
              </Typography>
              <ArrowDropDownIcon />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 250,
            overflow: "visible",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfileDialogOpen}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Account Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Lock fontSize="small" />
          </ListItemIcon>
          Lock
        </MenuItem>
        <MenuItem onClick={handleConfirmLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Sidebar
        isMobile={isMobile}
        open={open}
        toggleDrawer={toggleDrawer}
        sidebarData={sidebarData}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      <AdminProfileDialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </Box>
  );
};

export default PromotersDashboard;
