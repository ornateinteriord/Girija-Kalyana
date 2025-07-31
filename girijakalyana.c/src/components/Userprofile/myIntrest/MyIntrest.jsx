import { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Accepted from "./insidepage/accepted/Accepted";
import Requests from "./insidepage/requests/Request";
import Sent from "./sent/Sent";
import TokenService from "../../token/tokenService";
import { useGetInterestCounts } from "../../api/User/useGetProfileDetails";
import PageTitle from "../../UI/PageTitle";

const MyInterest = () => {
  const registrationNo = TokenService.getRegistrationNo();
  const [tabValue, setTabValue] = useState(0);
  const [counts, setCounts] = useState({
    accepted: 0,
    requests: 0,
    sent: 0,
  });

  const { data: countsData, refetch: refetchCounts } =
    useGetInterestCounts(registrationNo);

  useEffect(() => {
    if (countsData) {
      setCounts({
        requests: countsData.received || 0,
        sent: countsData.sent || 0,
        accepted: countsData.accepted || 0,
      });
    }
  }, [countsData]);

  const handleTabChange = (event, newValue) => {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    setTabValue(newValue);
  };

  const renderContents = () => {
    switch (tabValue) {
      case 0:
        return <Accepted />;
      case 1:
        return <Requests refetchCounts={refetchCounts} />;
      case 2:
        return <Sent refetchCounts={refetchCounts} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3, md: 2 },
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <PageTitle title="Interested Profiles" />
      {/* Tabs Section */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          "& .MuiTab-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Tab label={`Accepted (${counts.accepted})`} />
        <Tab label={`Requests (${counts.requests})`} />
        <Tab label={`Sent (${counts.sent})`} />
      </Tabs>

      {/* Content Section */}
      <Box
        sx={{
          padding: 0,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 1,
          color: "black",
        }}
      >
        {renderContents()}
      </Box>
    </Box>
  );
};

export default MyInterest;
