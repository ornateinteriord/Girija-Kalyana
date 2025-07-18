import React, { useState } from "react";
import { 
  Box, 
  Divider, 
  Tab, 
  Tabs, 
  Snackbar, 
  Alert, 
  Typography, 
  Paper 
} from "@mui/material";
import About from '../profile/about/About'
import Education from "../profile/eduction/Education";
import FamilyReligious from "../profile/familyReligious/FamilyReligious";
import LifeStyle from "../profile/lifeStyle/LifeStyle";
import Others from "../profile/others/Others";
import ParentsPrefer from "../profile/parentPreference/ParentsPrefer";
import Photos from "../profile/photo/Photos";
import PrivacySettings from "../profile/privacySettings/PrivacySettings";



const Profile = () => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderContent = () => {
    switch (value) {
      case 0: return <About render={setOpen} />;
      case 1: return <FamilyReligious render={setOpen} />;
      case 2: return <Education render={setOpen} />;
      case 3: return <Photos />;
      case 4: return <LifeStyle render={setOpen} />;
      case 5: return <ParentsPrefer />;
      case 6: return <Others />;       
      case 7: return <PrivacySettings />;
      default: return null;
    }
  };

  return (
    <Box
    sx={{
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 1,
      p: { xs: 1, sm: 3, md: 2 },
      maxWidth: 1200,
      justifySelf:{md:'start'},
      // mx: 'auto',
      width: { 
        xs: '40%',  
        sm: '90%',  
        md: '85%',   
        lg: '100%' 
      },
      '@media (min-width: 600px) and (max-width: 899px)': {

        width: '81%',
      },
      '@media (min-width: 375px) and (max-width: 428px)': {

        width: '44%',
      }
    }}
  >        
            <Typography variant="h5" fontWeight={700} mt={0}  color="#34495e">
              My Profile
            </Typography>
            {/* <Divider /> */}
          

          {/* Snackbar for success messages */}
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Updated Successfully
            </Alert>
          </Snackbar>

          {/* Tabs and content */}
          <Paper elevation={1} sx={{ p: 0}} >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="profile tabs"
              textColor="primary"
              indicatorColor="primary"
              // sx={{ mb: 0 }}
            >

              <Tab label="About" sx={{fontWeight:700,"&:hover": {
            backgroundColor: "transparent", 
            
          },}} />
              <Tab label="Family & Religious" sx={{fontWeight:700,"&:hover": {
                 backgroundColor: "transparent", 
            
          },}} />
              <Tab label="Education" sx={{fontWeight:700,"&:hover": {
            backgroundColor: "transparent", 
            
          },}}/>
              <Tab label="Photos" sx={{fontWeight:700,"&:hover": {
            backgroundColor: "transparent", 
            
          },}}/>
              <Tab label="LifeStyle" sx={{fontWeight:700,"&:hover": {
            backgroundColor: "transparent", 
            
          },}}/>
              <Tab label="Partner's Preference" sx={{fontWeight:700,"&:hover": {
            backgroundColor: "transparent", 
            
          },}}/>
              <Tab label="Others" sx={{fontWeight:700,"&:hover": {
            backgroundColor: "transparent", 
            
          },}}/>
              <Tab label="Privacy Setting" sx={{fontWeight:700,"&:hover": {
            backgroundColor: "transparent", 
            
          },}}/>
            </Tabs>
            <Box  >{renderContent()}</Box>
          </Paper>
        </Box>
    //   </Box>
    // </Box>
  );
};

export default Profile;
