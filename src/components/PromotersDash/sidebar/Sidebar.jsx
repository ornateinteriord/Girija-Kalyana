import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  Toolbar,
} from '@mui/material';
import {
  Dashboard,
  Person,
  Share,
  Search,
  ManageSearch,
  ImageSearch,
  TrendingUp,
  ArrowDropDown as ArrowDropDownIcon,
  Pending,
  CheckCircle,
  TimerOff,
  Groups,
  HowToReg,
  SupportAgent,
  Autorenew,
  Send,
  Inbox,
  AttachMoney,
  AccountBalanceWallet,
  Favorite,
  GroupAdd,
  PersonOff,
  PendingActions,
  TaskAlt,
  Event,
  Settings,
  Lock,
  Notifications,
  Email,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ 
  isMobile, 
  open, 
  toggleDrawer, 
  sidebarData 
}) => {
    const navigate = useNavigate();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (text, hasSubItems = false, path = null) => {
  const newOpenSubmenus = {};
  if (hasSubItems) {
    newOpenSubmenus[text] = !openSubmenus[text];
  } else if (path) {
    navigate(path); 
     console.log(path,"yy")
  }
  setOpenSubmenus(newOpenSubmenus);
  setSelectedItem(text);
};

const handleSubItemClick = (parentText, subItem) => {
  setSelectedItem(`${parentText}-${subItem.text}`);
  if (subItem.path) {
    navigate(subItem.path); 
   
  }
};

  const getIconComponent = (iconName, props = {}) => {
    const iconComponents = {
      Logout,
      Dashboard,
      Person,
      Share,
      Search,
      ManageSearch,
      ImageSearch,
      TrendingUp,
      ArrowDropDown: ArrowDropDownIcon,
      Pending,
      CheckCircle,
      TimerOff,
      Groups,
      HowToReg,
      SupportAgent,
      Autorenew,
      Send,
      Inbox,
      AttachMoney,
      AccountBalanceWallet,
      Favorite,
      GroupAdd,
      PersonOff,
      PendingActions,
      TaskAlt,
      Event,
      Settings,
      Lock,
      Notifications,
      Email,
    };
    
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent {...props} /> : null;
  };

 const renderSubItems = (subItems, parentText) => (
  <Collapse in={openSubmenus[parentText]} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      {subItems.map((item, index) => (
        <ListItem
          key={index}
          button
          onClick={() => handleSubItemClick(parentText, item)} // Pass the whole item
          sx={{
            pl: 4,
            py: 0.5,
            backgroundColor:
              selectedItem === `${parentText}-${item.text}` ? '#4d75d4' : 'transparent',
            '&:hover': { backgroundColor: '#4d75d4' },
          }}
        >
          <ListItemText
            primary={item.text}
            sx={{
              color: '#fff',
              '& .MuiTypography-root': { fontWeight: 'bold' },
            }}
            primaryTypographyProps={{ fontSize: '1rem' }}
          />
        </ListItem>
      ))}
    </List>
  </Collapse>
);

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={toggleDrawer}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          background: '#182848',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List sx={{ mt: '10px' }}>
          {sidebarData.menuItems.map((item, index,) => (
            <Box key={index}>
              <ListItem
                button
                onClick={() => handleItemClick(item.text, !!item.subItems,item.path)}
                sx={{
                  cursor: 'pointer',
                  pl: 2,
                  py: 1,
                  backgroundColor: selectedItem === item.text ? '#4d75d4' : 'transparent',
                  '&:hover': { backgroundColor: '#4d75d4' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 35, color: '#fff' }}>
                  {getIconComponent(item.icon)}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    cursor: 'pointer',
                    color: '#fff',
                    '& .MuiTypography-root': { fontWeight: 'bold' },
                  }}
                  primaryTypographyProps={{ fontSize: '1rem' }}
                />
                {item.subItems && (
                  <ArrowDropDownIcon
                    sx={{
                      color: '#fff',
                      transform: openSubmenus[item.text] ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s',
                    }}
                  />
                )}
              </ListItem>
              {item.subItems && (
                <Box
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: '#1a3151',
                    borderLeft: '3px solid #4d75d4',
                    ml: 0,
                  }}
                >
                  {renderSubItems(item.subItems, item.text)}
                </Box>
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;