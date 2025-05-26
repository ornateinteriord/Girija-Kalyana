import React, { useEffect, useState} from "react";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import Accepted from "./insidepage/accepted/Accepted";
import Requests from "./insidepage/requests/Request";
import Sent from "./sent/Sent";
import TokenService from "../../token/tokenService";
import { useGetInterestCounts,} from "../../api/User/useGetProfileDetails";




const MyInterest = () => {
  const registrationNo = TokenService.getRegistrationNo()
  const [tabValue, setTabValue] = useState(0);
  const [counts, setCounts] = useState({
    accepted: 0,
    requests: 0,
    sent: 0
  });

  const { data: countsData } = useGetInterestCounts(registrationNo);
  
 

 useEffect(() => {
  if (countsData) {
    setCounts({
      requests: countsData.received || 0,
      sent: countsData.sent || 0,
      accepted: countsData.accepted || 0
    });
  }
}, [countsData]);

const handleTabChange = (event, newValue) => {
  setTabValue(newValue);
};

 

  const renderContents = () => {
    switch (tabValue) {
      case 0:
        return <Accepted  />;
      case 1:
        return <Requests />;
      case 2:
        return <Sent  />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ padding: 0, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" fontWeight={900} color="#34495e">
          Interested Profiles
        </Typography>
        <Divider sx={{ marginTop: 1 }} />
      </Box>

      {/* Tabs Section */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ marginBottom: 2 }}
      >
        <Tab label={`Accepted (${counts.accepted})`} />
        <Tab label={`Requests (${counts.requests})`} />
        <Tab label={`Sent (${counts.sent})`} />
      </Tabs>

      {/* Content Section */}
      <Box sx={{ padding: 0, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1, color: "black" }}>
        {renderContents()}
      </Box>
    </Box>
  );
};

export default MyInterest;