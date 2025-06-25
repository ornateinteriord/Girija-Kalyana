import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import {
  Logout,
  Dashboard,
  Menu as MenuIcon,
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
} from "@mui/icons-material";
import { sidebarData } from "./data";
import AdminProfileDialog from "../Adminprofile/AdminProfile";

const PromotersDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(!isMobile);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const openMenu = Boolean(anchorEl);

  const toggleDrawer = () => setOpen(!open);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileDialogOpen = () => {
    setProfileDialogOpen(true);
    handleMenuClose();
  };

  const handleItemClick = (text, hasSubItems = false) => {
    const newOpenSubmenus = {};
    if (hasSubItems) newOpenSubmenus[text] = !openSubmenus[text];
    setOpenSubmenus(newOpenSubmenus);
    setSelectedItem(text);
  };

  const handleSubItemClick = (parentText, subItemText) => {
    setSelectedItem(`${parentText}-${subItemText}`);
  };

  const getIconComponent = (iconName, props = {}) => {
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
            onClick={() => handleSubItemClick(parentText, item.text)}
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(to right, #182848, #4d75d4)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2, display: { xs: 'inline-flex', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {sidebarData.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" sx={{ mr: 1, display: { xs: 'none', sm: 'inline-flex' } }}>
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton color="inherit" sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' } }}>
              <Badge badgeContent={3} color="error">
                <Email />
              </Badge>
            </IconButton>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                borderRadius: 1,
                p: 0.5
              }}
              onClick={handleMenuOpen}
            >
              <Avatar
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: '#4d75d4',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
                alt="Admin"
              >
                A
              </Avatar>
              <Typography variant="subtitle1" sx={{ ml: 1, mr: 1, fontWeight: 'bold' }}>
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
            overflow: 'visible',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

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
            {sidebarData.menuItems.map((item, index) => (
              <Box key={index}>
                <ListItem
                  button
                  onClick={() => handleItemClick(item.text, !!item.subItems)}
                  sx={{
                    cursor:'pointer',
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
                      cursor:'pointer',
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
                      cursor:'pointer',
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

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
        <Toolbar />
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: '#4a148c',
            fontWeight: 'bold', 
            textAlign: { xs: 'start', md: 'center' },
            fontSize: { xs: '1.5rem', sm: '2rem' },
            mb: 3
          }}
        >
          Welcome kirancomputers
        </Typography>
        
        <Divider sx={{ my: 2 }} />

        {/* Top Cards Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          <Card
            sx={{
              backgroundColor: '#f3e5f5',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              width: { xs: '100%', sm: '300px',md:'300px' },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Promoter Type
              </Typography>
              <Typography variant="h5" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                Premium 
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              backgroundColor: '#e8f5e9',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: { xs: '100%', sm: '300px',md:'300px' },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Promo Code
              </Typography>
              <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                KCPL2019
              </Typography>
            </CardContent>
          </Card>

             <Card
          sx={{
            backgroundColor: '#e3f2fd',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
           minWidth: { xs: '100%', sm: '300px',md:'300px' },
          }}
        >
          <CardContent
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Event color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Registration Dates
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 2,
                mt: 2,
              }}
            >
              <Chip
                label="Registered: 07-05-2019"
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 'bold',
                  borderWidth: 2,
                  fontSize: '0.9rem',
                }}
              />
              <Chip
                label="Expires: Aug 18, 2019"
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 'bold',
                  borderWidth: 2,
                  fontSize: '0.9rem',
                }}
              />
            </Box>
          </CardContent>
        </Card>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* User Cards Section */}
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            color: '#4a148c', 
            fontWeight: 'bold', 
            mb: 3,
            textAlign: 'center',
            fontSize: { xs: '1.3rem', sm: '1.5rem' }
          }}
        >
          User Statistics
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          {sidebarData.users.map((item, index) => (
            <Card
              key={index}
              sx={{
                flex: '1 1 300px',
                maxWidth: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' },
                minWidth: '280px',
                height: '140px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                borderLeft: `4px solid ${item.color}`,
                backgroundColor: '#ffffff',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    sx={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                      mr: 2,
                      width: 50,
                      height: 50,
                    }}
                  >
                    {getIconComponent(item.icon)}
                  </Avatar>
                  <Typography
                    variant="h5"
                    sx={{
                      color: item.color,
                      fontWeight: 'bold',
                      fontSize: '1.8rem',
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 'bold',
                    textAlign: 'start',
                    fontSize: '1.1rem'
                  }}
                >
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <AdminProfileDialog 
        open={profileDialogOpen} 
        onClose={() => setProfileDialogOpen(false)} 
      />
    </Box>
  );
};

export default PromotersDashboard;