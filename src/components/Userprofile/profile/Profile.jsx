import React, { useState } from "react";
import { 
  Box, 
  Tab, 
  Tabs, 
  Snackbar, 
  Alert, 
  Typography, 
  Paper, 
  useMediaQuery,
  useTheme
} from "@mui/material";
import About from '../profile/about/About';
import Education from "../profile/eduction/Education";
import FamilyReligious from "../profile/familyReligious/FamilyReligious";
import LifeStyle from "../profile/lifeStyle/LifeStyle";
import Others from "../profile/others/Others";
import ParentsPrefer from "../profile/parentPreference/ParentsPrefer";
import Photos from "../profile/photo/Photos";
import PrivacySettings from "../profile/privacySettings/PrivacySettings";
import PageTitle from "../../UI/PageTitle";

const Profile = () => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // true when screen is small

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

  const tabs = [
    "About", 
    "Family & Religious", 
    "Education", 
    "Photos", 
    "LifeStyle", 
    "Partner's Preference", 
    "Others", 
    "Privacy Setting"
  ];

  return (
    <Box sx={{
      borderRadius: 2,
      p: { xs: 0, sm: 3, md: 2 },
      maxWidth: "100%",
      justifySelf: { md: 'start' },
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
    }}>
      <Typography sx={{fontSize:{xs:"20px",md:"25px",
        color:'#34495E',textAlign:'left'
      }}}>My Profile</Typography>
      
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
          Updated Successfully
        </Alert>
      </Snackbar>

      {isSmallScreen ? (
        <Box sx={{ p: "0px 0px 20px 0px", background: 'transparent' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="profile tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab) => (
              <Tab 
                key={tab}
                label={tab}
                sx={{ 
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "transparent" } 
                }} 
              />
            ))}
          </Tabs>
          <Box>{renderContent()}</Box>
        </Box>
      ) : (

        <Paper elevation={2} sx={{ p: "10px 0px" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="profile tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab) => (
              <Tab 
                key={tab}
                label={tab}
                sx={{ 
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "transparent" } 
                }} 
              />
            ))}
          </Tabs>
          <Box>{renderContent()}</Box>
        </Paper>
      )}
    </Box>
  );
};

export default Profile;