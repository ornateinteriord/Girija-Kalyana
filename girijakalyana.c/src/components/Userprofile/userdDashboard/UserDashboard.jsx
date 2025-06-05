import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Pagination,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import TokenService from "../../token/tokenService";

import HomeUserTable from "../../userupgrade/HomeUserTable";
import { useGetMemberDetails } from "../../api/User/useGetProfileDetails";
import { LoadingComponent } from "../../../App";

const UserDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.between("sm", "md"));
  const registerNo = TokenService.getRegistrationNo();
  
  const {
    data: userProfile,
    isLoading,
    isError,
    error,
  } = useGetMemberDetails(registerNo);

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  // Dummy array to mimic profile card layout (replace later)
  const dummyProfiles = []; // keep empty or fill with mock data if needed

  const currentCards = dummyProfiles.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: {
          xs: "10px 12px",
          sm: "10px 16px",
          md: "10px ",
        },
        mt: "0",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          fontWeight="bold"
          color="#34495e"
          textTransform="capitalize"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
            },
          }}
        >
          Welcome {userProfile?.first_name || "User"} {userProfile?.last_name || ""}
        </Typography>
        <Divider sx={{ mt: 1,height:'1px' }} />
      </Box>

      <Stack spacing={3}>
        <Box sx={{ 
          width: "100%",
          overflowX: isSmallScreen ? "auto" : "visible",
        }}>
          <HomeUserTable />
        </Box>

        {/* Interested Profiles Section (UI only, logic removed) */}
        <Box>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            flexDirection={isSmallScreen ? "column" : "row"}
            gap={isSmallScreen ? 1 : 0}
          >
            <Typography
              variant={isSmallScreen ? "h5" : "h4"}
              fontWeight="bold"
              mb={2}
              sx={{ 
                color: "#34495e",
                fontSize: {
                  xs: "1.3rem",
                  sm: "2rem",
                },
                alignSelf: isSmallScreen ? "flex-start" : "center"
              }}
            >
              Interested Profiles
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Showing {currentCards.length} of {dummyProfiles.length} profiles
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {currentCards.length > 0 ? (
              currentCards.map((profile, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ProfileCard profile={profile} isSmallScreen={isSmallScreen} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  sx={{
                    color: "black",
                    fontSize: "17px",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  No interested profiles yet.
                </Typography>
              </Grid>
            )}
          </Grid>

          {dummyProfiles.length > cardsPerPage && (
            <Box sx={{ 
              display: "flex",
              justifyContent: {
                xs: "center",
                sm: "flex-end",
              },
              mt: 3,
            }}>
              <Pagination
                count={Math.ceil(dummyProfiles.length / cardsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
                size={isSmallScreen ? "small" : "medium"}
              />
            </Box>
          )}
        </Box>
      </Stack>
       {isLoading && <LoadingComponent/>}
    </Box>
  );
};

const ProfileCard = ({ profile, isSmallScreen }) => (
  <Box
    sx={{
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "16px",
      width: "100%",
      maxWidth: "400px",
      minWidth: isSmallScreen ? "280px" : "auto",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      },
      margin: isSmallScreen ? "0 auto" : "0",
    }}
  >
    <Box display="flex" alignItems="center">
      <Box 
        display="flex" 
        justifyContent="space-evenly" 
        alignItems="center"
        width="100%"
        flexDirection={isSmallScreen ? "column" : "row"}
        textAlign={isSmallScreen ? "center" : "left"}
      >
        <img
          src={profile.profile_img || "/default-profile.png"}
          alt="Profile"
          style={{
            width: isSmallScreen ? "80px" : "100px",
            height: isSmallScreen ? "80px" : "100px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: isSmallScreen ? "10px" : "0",
          }}
          onError={(e) => {
            e.target.src = "/default-profile.png";
          }}
        />
        <Box ml={isSmallScreen ? 0 : 2}>
          <Typography 
            variant={isSmallScreen ? "subtitle1" : "h6"} 
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
              }
            }}
          >
            {profile.first_name || "N/A"} {profile.last_name || ""}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {profile.city || "Location not specified"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Reg No: {profile.registration_no || "N/A"}
          </Typography>
        </Box>
      </Box>
    </Box>
    <Box
      display="flex"
      justifyContent="space-between"
      mt={2}
      sx={{ fontSize: "14px", color: "gray" }}
    >
      <Box textAlign="center">
        <Typography fontWeight="bold">
          {profile.age || "N/A"} yrs
        </Typography>
        <Typography>Age</Typography>
      </Box>
      <Box textAlign="center">
        <Typography fontWeight="bold">
          {profile.height || "N/A"}
        </Typography>
        <Typography>Height</Typography>
      </Box>
      <Box textAlign="center">
        <Typography fontWeight="bold">
          {profile.occupation || "N/A"}
        </Typography>
        <Typography>Occupation</Typography>
      </Box>
    </Box>
   
  </Box>
);

export default UserDashboard;