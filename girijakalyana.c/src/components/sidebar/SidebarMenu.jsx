import React from "react";
import { List, ListItem, Box, Button, Typography } from "@mui/material";
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaHeart,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";

const SidebarMenu = ({
  selectedItem,
  handleDashboardClick,
  handleProfileClick,
  handleMatchesClick,
  handleInterestClick,
  handleViewAllClick,
  handleSearchClick,
  handleOpenLogoutDialog,
  userProfile,
}) => {
  const menuItems = [
    {
      text: "Dashboard",
      icon: <FaTachometerAlt />,
      onClick: handleDashboardClick,
    },
    {
      text: "My Profile",
      icon: <FaUser />,
      onClick: handleProfileClick,
    },
    {
      text: "My Matches",
      icon: <FaUsers />,
      onClick: handleMatchesClick,
    },
    {
      text: "My Interest",
      icon: <FaHeart />,
      onClick: handleInterestClick,
    },
    {
      text: "View All",
      icon: <FaUsersViewfinder />,
      onClick: handleViewAllClick,
    },
    {
      text: "Search",
      icon: <FaSearch />,
      onClick: handleSearchClick,
    },
    {
      text: "Logout",
      icon: <FaSignOutAlt />,
      onClick: handleOpenLogoutDialog,
    },
  ];

  return (
    <Box sx={{ overflow: "auto" }}>
      <List>
        <ListItem>
          <Box sx={{ textAlign: "center", py: 0 }}>
            <Typography
              variant="h5"
              marginLeft={2}
              textTransform={"capitalize"}
            >
              {userProfile?.first_name}
            </Typography>
          </Box>
        </ListItem>

        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            onClick={item.onClick}
            sx={{
              backgroundColor:
                selectedItem === item.text ? "#1976d2" : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              borderRadius: "2px",
              mx: 0,
              my: 2,
            }}
          >
            <Button
              variant="text"
              startIcon={item.icon}
              sx={{
                color: "#fff",
                fontSize: "1.2rem",
                textTransform: "capitalize",
                marginLeft: "10px",
                width: "100%",
                justifyContent: "flex-start",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {item.text}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SidebarMenu;