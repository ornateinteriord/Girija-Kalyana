import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import {  FaUser, FaUsers, FaServer, FaReceipt, FaBars, FaChevronDown, FaChevronUp, FaDashcube, FaIdBadge } from 'react-icons/fa';
import { TbMessageReportFilled } from 'react-icons/tb';
import { IoIosNotifications } from 'react-icons/io';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Collapse, List, ListItem, ListItemText, IconButton, Typography, Menu, MenuItem, Avatar, Badge, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';
import { IoMdNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { getAllUserCounts } from '../api/Admin';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const [openAssistanceService, setOpenAssistanceService] = useState(false);
  const [openPromoterManagement, setOpenPromoterManagement] = useState(false);
  const [openPromoterReceipts, setOpenPromoterReceipts] = useState(false);
  const [openPromoterReports, setOpenPromoterReports] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Admin",
    email: "admin@example.com",
    phone: "123-456-7890",
    profilePicture: null,
  });
  const [activePath, setActivePath] = useState('');
  const location = useLocation();
  
  const navigate = useNavigate();
  const adminName = "Admin";
  
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      navigate('/admin'); 
    }
    setActivePath(location.pathname);
  }, [location.pathname]);

const closeAllDropdowns = () => {
  setOpenUserManagement(false);
  setOpenAssistanceService(false);
  setOpenPromoterManagement(false);
  setOpenPromoterReceipts(false);
  setOpenPromoterReports(false);
};

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleUserManagement = () => {
      closeAllDropdowns();
    setOpenUserManagement(!openUserManagement);
  };

  const toggleAssistanceService = () => {
      closeAllDropdowns();
    setOpenAssistanceService(!openAssistanceService);
  };

  const togglePromoterManagement = () => {
      closeAllDropdowns();
    setOpenPromoterManagement(!openPromoterManagement);
  };
  const toggleReceiptsManagement = () => {
      closeAllDropdowns();
    setOpenPromoterReceipts(!openPromoterReceipts);
  };
  const toggleReportManagement = () => {
      closeAllDropdowns();
    setOpenPromoterReports(!openPromoterReports);
  };
  
  const navigateUserTable = () => {
    navigate('/admin/user-table');
  };
  const handleDashboard=()=>{
      closeAllDropdowns();
    navigate('/admin/dashboard');
  }
  const navigateUserUpgrade=()=>{
    navigate('/admin/userData');
  }
  
  const navigateRenewals=()=>{
    navigate('/admin/renewals');
  }
  const navigateresetpass=()=>{
    navigate('/admin/resetpass');
  }
  const navigateImageVerify=()=>{
    navigate('/admin/imageverify');
  }
  const navigatePendingdata=()=>{
    navigate('/admin/pendingdata');
  }
  const navigateSuccessdata=()=>{
    navigate('/admin/successdata');
  }
  const navigatePromoterdata=()=>{
    navigate('/admin/promotersdata');
  }
  const navigatePaytopromoters=()=>{
    navigate('/admin/paytopromoters');
  }
  const navigatePromotersEarn=()=>{
    navigate('/admin/promoterearn');
  }
  const navigatePromotersData=()=>{
    navigate('/admin/promoters');
  }
  const navigatePromotersUsers=()=>{
    navigate('/admin/promotersusers');
  }
  const navigateOnlineTransaction=()=>{
    navigate('/admin/onlinetransaction');
  }
  const navigateAssistanceData=()=>{
    navigate('/admin/assistance');
  }
  const navigateReceiptsvocher=()=>{
    navigate('/admin/receiptsvocher');
  }

  const navigateUserReports=()=>{
    navigate('/admin/userreports');
  }
  const navigateRenewalReports=()=>{
    navigate('/admin/renewalreports');
  }
  const navigateReceiptsReportsdata=()=>{
    navigate('/admin/receiptsreports');
  }
  const navigateNotification=()=>{
      closeAllDropdowns();
    navigate('/admin/notification');
  }
  
  // Check if a path is active
  const isActive = (path) => {
    return activePath === path;
  };

  // Profile dialog handlers
  const handleProfileDialogOpen = () => {
    setProfileDialogOpen(true);
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
const handleLogoutDialogOpen = () => {
  setLogoutDialogOpen(true);
  handleMenuClose(); 
};

const handleLogoutDialogClose = () => {
  setLogoutDialogOpen(false);
};

const handleConfirmLogout = () => {
  localStorage.removeItem('token');
  navigate('/');
  setLogoutDialogOpen(false);
};
  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      profilePicture: URL.createObjectURL(file),
    }));
  };

  return (
    <div>
    <div className={`Dash-app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Navbar */}
      <nav className="Dashnavbar">
        <div className="Dashmenu">
          <IconButton onClick={toggleSidebar}>
            <FaBars style={{ color: '#fff', fontSize: '1.8rem' }} />
          </IconButton>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}><h2 className="navtxt">Admin Dashboard</h2></Link>
        </div>
        <div className="nav-right">
        <Badge color="error" variant="dot">
        <IoMdNotifications fontSize={40} cursor={'pointer'}/>
        </Badge>
         
        <IconButton onClick={handleMenuOpen}>
            <Avatar alt="Admin Profile" src="/path-to-profile-pic.jpg" style={{background:'black'}}/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem 
              onClick={handleLogoutDialogOpen}
            >
              Logout
            </MenuItem>
          </Menu>
          <Typography style={{ color: '#fff', marginRight: '10px',fontSize:'22px',fontWeight:'bold',fontFamily:'Outfit sans-serif' }}>
            {adminName}
          </Typography>
         
        </div>
      </nav>
    </div>
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{
          overflowY: 'auto',
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
          '&::-webkit-scrollbar': {
            display: 'none', 
          }
        }}>
          <List sx={{ width: '100%' }}>
          <ListItem
            onClick={handleProfileDialogOpen}
            sx={{ 
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: isActive('/admin/profile') ? '#1976d2' : 'transparent',
              '&:hover': {
                backgroundColor: isActive('/admin/profile') ? '#1976d2' : 'rgba(0, 0, 0, 0.04)',
                color: 'aqua'
              }
            }}
          >
            <CgProfile /> Profile
          </ListItem>

            <ListItem 
              onClick={handleDashboard} 
              sx={{ 
                cursor: 'pointer',
                padding: '14px',
                borderRadius:'4px',
                backgroundColor: isActive('/admin/dashboard') ? '#1976d2' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/admin/dashboard') ? '#1976d2' : 'rgba(0, 0, 0, 0.04)',
                  color: 'aqua'
                }
              }}
            >
              <FaDashcube /> Dashboard
            </ListItem>

            {/* User Management Dropdown */}
           <ListItem 
              button 
              onClick={toggleUserManagement}
              sx={{ 
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: openUserManagement ? '#1976d2' : 'transparent',
                color: openUserManagement ? '#fff' : 'inherit',
                '&:hover': {
                  backgroundColor: openUserManagement ? '#1565c0' : 'transparent',
                  color: 'aqua'
                },
              }}
            >
              <FaUser />
              <ListItemText primary="User Management" />
              {openUserManagement ? <FaChevronUp /> : <FaChevronDown />}
            </ListItem>
            <Collapse in={openUserManagement} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ width: '100%',marginLeft:'20px' }}>
                <ListItem 
                  button 
                  onClick={navigateUserTable}
                  sx={{
                    padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/user-table') ? 'aqua' : '',
                    '&:hover': {
                    color: isActive('/admin/user-table') ?  'darkaqua' : 'aqua',
                   
                    }
                  }}
                >
                  <ListItemText primary="User Table" />
                </ListItem>
          
                <ListItem 
                  button 
                  onClick={navigateUserUpgrade}
                  sx={{
                    padding: '0px ',
                    borderRadius:'2px',
                    color: isActive('/admin/userData') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/userData') ? 'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="User Upgrade" />
                </ListItem>
     
                <ListItem 
                  button 
                  onClick={navigateRenewals}
                  sx={{
                 padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/renewals') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/renewals') ? 'darkaqua' : 'aqua',
                      
                    }
                  }}
                >
                  <ListItemText primary="Renewal" />
                </ListItem>             
          
                <ListItem 
                  button 
                  onClick={navigateresetpass}
                  sx={{
                   padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/resetpass') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/resetpass') ? 'darkaqua' : 'aqua',
                   
                    }
                  }}
                >
                  <ListItemText primary="Password" />
                </ListItem>
          
                <ListItem 
                  button 
                  onClick={navigateImageVerify}
                  sx={{
                    padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/imageverify') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/imageverify') ?  'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Image Verification" />
                </ListItem>
              </List>
            </Collapse>

            {/* Assistance Service Dropdown */}
            <ListItem 
              button 
              onClick={toggleAssistanceService}
              sx={{ 
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: openAssistanceService ? '#1976d2' : 'transparent',
                color: openAssistanceService ? '#fff' : 'inherit',
                '&:hover': {
                  backgroundColor: openAssistanceService ? '#1565c0' : 'rgba(0, 0, 0, 0.04)',
                  color: 'aqua'
                }
              }}
            >
              <FaServer />
              <ListItemText primary="Assistance Service" />
              {openAssistanceService ? <FaChevronUp /> : <FaChevronDown />}
           </ListItem>
            <Collapse in={openAssistanceService} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ width: '100%',marginLeft:'20px' }}>
                <ListItem 
                  button 
                  onClick={navigatePendingdata}
                  sx={{
                    padding: '0',
                    borderRadius:'2px',
                  color: isActive('/admin/pendingdata') ? 'aqua' : '',
                    '&:hover': {
                     color: isActive('/admin/pendingdata') ?  'darkaqua' : 'aqua',
                    
                    }
                  }}
                >
                  <ListItemText primary="Pending" />
                </ListItem>
          
                <ListItem 
                  button 
                  onClick={navigateSuccessdata}
                  sx={{
                  padding: '0',
                    borderRadius:'2px',
                  color: isActive('/admin/successdata') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/successdata') ? 'darkaqua' : 'aqua',
                      
                    }
                  }}
                >
                  <ListItemText primary="Success" />
                </ListItem>
           
                <ListItem 
                  button 
                  onClick={navigatePromoterdata}
                  sx={{
                   padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/promotersdata') ? 'aqua' : '',
                    '&:hover': {
                   color: isActive('/admin/promotersdata') ?  'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Promoter User" />
                </ListItem>
              </List>
            </Collapse>

            {/* Promoter Management Dropdown */}
            <ListItem 
              button 
              onClick={togglePromoterManagement}
              sx={{ 
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: openPromoterManagement ? '#1976d2' : 'transparent',
                color: openPromoterManagement ? '#fff' : 'inherit',
                '&:hover': {
                  backgroundColor: openPromoterManagement ? '#1565c0' : 'rgba(0, 0, 0, 0.04)',
                  color: 'aqua'
                }
              }}
            >
              <FaUsers />
              <ListItemText primary="Promoter Management" />
              {openPromoterManagement ? <FaChevronUp /> : <FaChevronDown />}
            </ListItem>
            <Collapse in={openPromoterManagement} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ width: '100%',marginLeft:'20px' }}>
                <ListItem 
                  button 
                  onClick={navigatePromotersData}
                  sx={{
                   padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/promoters') ? 'aqua' : '',
                    '&:hover': {
                  color: isActive('/admin/promoters') ?  'darkaqua' : 'aqua',
                      
                    }
                  }}
                >
                  <ListItemText primary="Promoters" />
                </ListItem>
             
                <ListItem 
                  button 
                  onClick={navigatePromotersUsers}
                  sx={{
                  padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/promotersusers') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/promotersusers') ?  'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Promoter Users" />
                </ListItem>
              
                <ListItem 
                  button 
                  onClick={navigatePromotersEarn}
                  sx={{
                   padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/promoterearn') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/promoterearn') ?  'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Promoter Earnings" />
                </ListItem>
      
                <ListItem 
                  button 
                  onClick={navigatePaytopromoters}
                  sx={{
                   padding: '0',
                    borderRadius:'2px',
                   color: isActive('/admin/paytopromoters') ? 'aqua' : '',
                    '&:hover': {
                     color: isActive('/admin/paytopromoters') ?  'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Pay to Promoters" />
                </ListItem>
              </List>
            </Collapse>
           
             {/* Promoter Receipts Dropdown */}
            <ListItem 
              button 
              onClick={toggleReceiptsManagement}
              sx={{ 
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: openPromoterReceipts ? '#1976d2' : 'transparent',
                color: openPromoterReceipts ? '#fff' : 'inherit',
                '&:hover': {
                  backgroundColor: openPromoterReceipts ? '#1565c0' : 'rgba(0, 0, 0, 0.04)',
                  color: 'aqua'
                }
              }}
            >
              <FaReceipt />
              <ListItemText primary="Receipts" />
              {openPromoterReceipts ? <FaChevronUp /> : <FaChevronDown />}
            </ListItem>
            <Collapse in={openPromoterReceipts} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ width: '100%',marginLeft:'20px' }}>
                <ListItem 
                  button 
                  onClick={navigateOnlineTransaction}
                  sx={{
                   padding: '0',
                    borderRadius:'2px',
                  color: isActive('/admin/onlinetransaction') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/onlinetransaction') ?  'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Online Transaction" />
                </ListItem>
       
                <ListItem 
                  button 
                  onClick={navigateAssistanceData}
                  sx={{
                   padding: '0',
                    borderRadius:'2px',
                color: isActive('/admin/assistance') ? 'aqua' : '',
                    '&:hover': {
                    color: isActive('/admin/assistance') ? 'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Assistance Online Transaction" />
                </ListItem>
               
                <ListItem 
                  button 
                  onClick={navigateReceiptsvocher}
                  sx={{
                   padding: '0',
                    borderRadius:'2px',
                   color: isActive('/admin/receiptsvocher') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/receiptsvocher') ?  'darkaqua' : 'aqua',
                    
                    }
                  }}
                >
                  <ListItemText primary="Receipt Voucher" />
                </ListItem>
              </List>
            </Collapse>

               {/* Reports Dropdown */}
             <ListItem 
               button 
               onClick={toggleReportManagement}
               sx={{ 
                 cursor: 'pointer',
                 padding: '10px',
                 borderRadius: '4px',
                 backgroundColor: openPromoterReports ? '#1976d2' : 'transparent',
                 color: openPromoterReports ? '#fff' : 'inherit',
                 '&:hover': {
                   backgroundColor: openPromoterReports ? '#1565c0' : 'rgba(0, 0, 0, 0.04)',
                   color: 'aqua'
                 }
               }}
             >
               <TbMessageReportFilled /> 
              <ListItemText primary="Reports" />
              {openPromoterReports ? <FaChevronUp /> : <FaChevronDown />}
            </ListItem>
            <Collapse in={openPromoterReports} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ width: '100%',marginLeft:'20px' }}>
                <ListItem 
                  button 
                  onClick={navigateUserReports}
                  sx={{
                    padding: '0',
                    borderRadius:'2px',
                  color: isActive('/admin/userreports') ? 'aqua' : '',
                    '&:hover': {
                      color: isActive('/admin/userreports') ? 'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Users" />
                </ListItem>
               
                <ListItem 
                  button 
                  onClick={navigateRenewalReports}
                  sx={{
                    padding: '0',
                    borderRadius:'2px',
                    color: isActive('/admin/renewalreports') ? 'aqua' : '',
                    '&:hover': {
                   color: isActive('/admin/renewalreports') ?  'darkaqua' : 'aqua',
                    
                    }
                  }}
                >
                  <ListItemText primary="Renewals" />
                </ListItem>
              
                <ListItem 
                  button 
                  onClick={navigateReceiptsReportsdata}
                  sx={{
                  padding: '0',
                    borderRadius:'2px',
                 color: isActive('/admin/receiptsreports') ? 'aqua' : '',
                    '&:hover': {
                     color: isActive('/admin/receiptsreports') ?  'darkaqua' : 'aqua',
                     
                    }
                  }}
                >
                  <ListItemText primary="Receipts" />
                </ListItem>
              </List>
            </Collapse>
            {/* notification */}
            <ListItem 
              button 
              onClick={navigateNotification}
              sx={{ 
                cursor: 'pointer',
                padding: '10px',
                borderRadius:'4px',
                backgroundColor: isActive('/admin/notification') ? '#1976d2' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/admin/notification') ? '#1976d2' : 'rgba(0, 0, 0, 0.04)',
                  color: 'aqua'
                }
              }}
            >
              <IoIosNotifications />
              <ListItemText primary="Notifications" />
            </ListItem>
          </List>
        </aside>

        {/* Logout Confirmation Dialog */}
<Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose}>
  <DialogTitle>Confirm Logout</DialogTitle>
  <DialogContent>
    <Typography>
    Are you sure you want to logout from your account?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={handleLogoutDialogClose} 
      color="primary"
    >
      Cancel
    </Button>
    <Button 
      onClick={handleConfirmLogout} 
      color="error" 
      variant="contained"
    >
      Logout
    </Button>
  </DialogActions>
</Dialog>

         {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onClose={handleProfileDialogClose}>
      <DialogTitle color='black' fontWeight={700} display={'flex'} 
      justifyContent={'center'} mt={1} fontSize={24}>Edit Profile</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={userProfile.name}
          onChange={handleProfileChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={userProfile.email}
          onChange={handleProfileChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          name="phone"
          value={userProfile.phone}
          onChange={handleProfileChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          component="label"
          style={{
            marginTop: "10px",
            textTransform: "capitalize",
            background: "#34495e",
          }}

        >
          Upload Profile Picture
          <input
            type="file"
            hidden
            onChange={handleImageUpload}
          />
        </Button>

        {userProfile.profilePicture && (
          <img
            src={userProfile.profilePicture}
            alt="Profile Preview"
            style={{ marginTop: "10px", width: "100%", borderRadius: "10px" }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleProfileDialogClose}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleProfileDialogClose} 
          color="success"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>

        {/* Main Content */}
        <div
          className="main-content"
          style={{
            paddingLeft: isSidebarOpen ? '280px' : '0px',
            paddingTop: isSidebarOpen ? '10px' : '10px',
            transition: 'padding-left 0.3s ease',
          }}
        >
          <Outlet />
        </div>
      </div>
    
  );
}

export default AdminDashboard;