import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Pagination,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import { FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

import {
  useGetAllUsersProfiles,
} from "../../api/User/useGetProfileDetails";
import TokenService from "../../token/tokenService";
import { LoadingComponent } from "../../../App";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import GenderFilter from "../../../utils/Filters/GenderFilter";
import AboutPop from "./popupContent/abouPop/AboutPop";
import FamilyPop from "./popupContent/familyPop/FamilyPop";
import EducationPop from "./popupContent/educationPop/EducationPop";
import LifeStylePop from "./popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "./popupContent/preferencePop/PreferencePop";

const itemsPerPage = 8;

const ViewAll = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { data: users = [], isLoading } = useGetAllUsersProfiles();
  const loggedInUserId = TokenService.getRegistrationNo();

  const handleStatusChange = useCallback((value) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (
        user.registration_no === loggedInUserId ||
        user.user_role === "Admin"
      ) {
        return false;
      }

      if (selectedStatus !== "all" && user.gender !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [users, loggedInUserId, selectedStatus]);

  const paginatedUsers = useMemo(
    () =>
      filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredUsers, currentPage]
  );

  const handleOpenDialog = useCallback((user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  }, []);

  const renderDialogContent = () => {
    if (!selectedUser) return null;

    const contentMap = {
      0: <AboutPop userDetails={selectedUser} />,
      1: <FamilyPop userDetails={selectedUser} />,
      2: <EducationPop userDetails={selectedUser} />,
      3: <LifeStylePop userDetails={selectedUser} />,
      4: <PreferencePop userDetails={selectedUser} />,
    };

    return contentMap[currentTab] || null;
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const renderUserCard = (user) => {
    const age = user.age || calculateAge(user.date_of_birth);

    return (
      <Card
        key={user._id}
        sx={{
          width: { xs: 300, sm: 280, md: 260, lg: 280 },
          height: "auto", // Fixed height
          borderRadius: 4,
          boxShadow: 3,
          overflow: "hidden",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
          display: "flex",
          flexDirection: "column",
          position: "relative",
          mx: "auto",
        }}
      >
        {/* Premium badge */}
        {user.user_role === "PremiumUser" && (
          <Chip
            label="PREMIUM"
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: "bold",
              fontSize: { xs: "0.6rem", sm: "0.7rem" },
            }}
          />
        )}

        {/* Profile image container */}
        <Box
          sx={{
            pt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: 100, sm: 120, md: 110, lg: 120 },
              height: { xs: 100, sm: 120, md: 110, lg: 120 },
              borderRadius: "50%",
              border: "3px solid #87CEEB",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              mb: 2,
              position: "relative",
              zIndex: 1,
              padding: "2px",
              background: "linear-gradient(45deg, #87CEEB, #E0F7FA)",
            }}
          >
            <Avatar
              src={user?.image}
              alt="Profile"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>

        {/* Card content with flex-grow to push button to bottom */}
        <CardContent
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1, // This makes the content take available space
            px: { xs: 1, sm: 2 },
            pt: 0,
            pb: 2,
          }}
        >
          {/* Name and age */}
          <Box sx={{ textAlign: "center", mb: 0.5 }}>
            <Typography
              fontWeight="bold"
              sx={{
                fontSize: { xs: "16px", sm: "17px", md: "16px", lg: "17px" },
              }}
            >
              {user.first_name} {user.last_name}
            </Typography>
            <Typography color="text.secondary">{age || "N/A"} yrs</Typography>
          </Box>

          {/* Occupation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 0.5,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            <FaBriefcase size={14} color="#777" style={{ marginRight: 6 }} />
            <Typography variant="body2" color="text.secondary">
              {user.occupation || "Not specified"}
            </Typography>
          </Box>

          {/* Location */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
            }}
          >
            <FaMapMarkerAlt size={14} color="#777" style={{ marginRight: 6 }} />
            <Typography variant="body2">
              {[user.city, user.state, user.country]
                .filter(Boolean)
                .join(", ") || "Location not specified"}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Details row */}
          <Box display="flex" justifyContent="space-around" width="100%" my={2}>
            <ProfileInfo label="Height" value={user.height || "N/A"} />
            <ProfileInfo label="Religion" value={user.religion || "N/A"} />
            <ProfileInfo label="Caste" value={user.caste || "N/A"} />
          </Box>

          {/* Button container with margin-top auto */}
          <Box sx={{ mt: "auto", width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog(user)}
              sx={{
                borderRadius: 2,
                py: 1,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              }}
            >
              View More
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        backgroundColor: "#f9f9f9",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on desktop
          gap: 2,
          mb: 3,
        }}
      >
        {/* Left-aligned heading */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            alignSelf: { xs: "flex-start", sm: "center" },
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
          }}
        >
          Profiles
        </Typography>

        {/* Right-aligned filter */}
        <GenderFilter
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
        />
      </Box>

      {/* User cards grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: { xs: 2, sm: 3 },
          justifyContent: "center",
        }}
      >
        {paginatedUsers.map(renderUserCard)}
      </Box>

      {/* Profile Dialog */}
      {selectedUser && (
        <ProfileDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          selectedUser={selectedUser}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          loggedInUserId={loggedInUserId}
          isLoading={false}
          renderDialogContent={renderDialogContent}
        />
      )}

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <Box display="flex" justifyContent={"end"} my={3}>
          <Pagination
            count={Math.ceil(filteredUsers.length / itemsPerPage)}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            size={window.innerWidth < 600 ? "small" : "medium"}
          />
        </Box>
      )}

      {/* Loading state */}
      {isLoading && <LoadingComponent />}
    </Box>
  );
};

/**
 * Helper component for profile information display
 */
const ProfileInfo = ({ label, value }) => (
  <Box textAlign="center" sx={{ px: 1 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
    >
      {label}
    </Typography>
    <Typography
      variant="subtitle2"
      fontWeight="bold"
      sx={{
        fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.8rem", lg: "0.85rem" },
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default ViewAll;
