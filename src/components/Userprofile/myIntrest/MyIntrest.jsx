import { useEffect, useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import Accepted from "./insidepage/accepted/Accepted";
import Requests from "./insidepage/requests/Request";
import Sent from "./sent/Sent";
import TokenService from "../../token/tokenService";
import { useGetInterestCounts } from "../../api/User";
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
        return <Accepted refetchCounts={refetchCounts} />;
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
        p: { xs: 0, sm: 3, md: 2 },
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: "21px", sm: "25px" },
          color: "#34495e",
          mt: { xs: 1 },
          mb: { xs: 1, md: 2 },
        }}
        fontWeight="500px"
      >
        Interested Profiles
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: { xs: 1, sm: 2 },
          "& .MuiTab-root": {
            textTransform: "capitalize",
            fontWeight: 600,
            color: "#444",
            "&:hover": {
              backgroundColor: "rgba(26, 79, 114, 0.1)",
              color: "#1a4f72",
            },
          },
          "& .Mui-selected": {
            color: "#1a4f72 !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#1a4f72",
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
