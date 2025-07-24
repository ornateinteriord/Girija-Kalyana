import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Pagination,
  Button,
} from "@mui/material";
import { FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import TokenService from "../../token/tokenService";
import {
  useGetMyMatches,
} from "../../api/User/useGetProfileDetails";
import AboutPop from "../viewAll/popupContent/abouPop/AboutPop";
import FamilyPop from "../viewAll/popupContent/familyPop/FamilyPop";
import EducationPop from "../viewAll/popupContent/educationPop/EducationPop";
import LifeStylePop from "../viewAll/popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "../viewAll/popupContent/preferencePop/PreferencePop";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import GenderFilter from "../../../utils/Filters/GenderFilter";
import { isSilverOrPremiumUser } from "../../../utils/common";
import OthersPop from "../viewAll/popupContent/others/OthersPop";
import { isSilverOrPremiumUser, LoadingTextSpinner } from "../../../utils/common";



const MyMatches = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const itemsPerPage = 8;
  const registerNo = TokenService.getRegistrationNo();



  const {
    mutate: fetchProfiles,
    data,
    isPending: isUsersLoading,
  } = useGetMyMatches(registerNo);

  const handleOpenDialog = useCallback((user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  }, []);

   const filteredUsers = useMemo(() => {
    if (!data?.content) return [];

    return data.content.filter((user) => {
      if (selectedStatus !== "all" && user.gender !== selectedStatus)
        return false;
      return true;
    });
  }, [data, selectedStatus]);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrentPage(1); 
  };
    useEffect(() => {
      fetchProfiles({ page: currentPage - 1, pageSize: itemsPerPage });
    }, [currentPage, selectedStatus, fetchProfiles]);

    const totalPages = useMemo(() => {
        return data ? Math.ceil(data.totalRecords / itemsPerPage) : 1;
      }, [data]); 

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const renderDialogContent = () => {
    if (!selectedUser) return null;

    const contentMap = {
      0: <AboutPop userDetails={selectedUser} />,
      1: <FamilyPop userDetails={selectedUser} />,
      2: <EducationPop userDetails={selectedUser} />,
      3: <LifeStylePop userDetails={selectedUser} />,
      4: <PreferencePop userDetails={selectedUser} />,
      4: <PreferencePop userDetails={selectedUser} />,
      5: <OthersPop userDetails={selectedUser} />
    };

    return contentMap[currentTab] || null;
  };
  

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, backgroundColor: "#f9f9f9" }}>
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
          My Matches
        </Typography>

        {/* Right-aligned filter */}
        <GenderFilter
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
        />
      </Box>

      { isUsersLoading ? (
        <LoadingTextSpinner />
      ) : filteredUsers.length === 0 ? (
        <Typography variant="h6" textAlign="center" mt={4}>
          No matches found based on your preferences.
        </Typography>
      ) : (
       <Box
  sx={{
    display: {
      xs: "flex", 
      sm: "grid",
    },
    flexDirection: "column",
    alignItems: "center",
    gridTemplateColumns: {
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
      lg: "repeat(4, 1fr)",
    },
    gap: { xs: 2, sm: 3 },
  }}
>

          {filteredUsers?.map((user) => {
           return(
            <Card
              key={user.registration_no}
              sx={{
                width: { xs: 300, sm: 280, md: 260 },
                borderRadius: 4,
                boxShadow: 3,
                p: 2,
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
                display: "flex", 
                flexDirection: "column", 
                height: "100%", 
                color: "#000"
              }}
            >
              {/* Premium badge */}
              {isSilverOrPremiumUser(user?.type_of_user) && (
                <Chip
                  label="PREMIUM"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: "bold",
                    backgroundColor:"#FFD700"
                  }}
                />
              )}

              {/* Profile Image */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  border: "3px solid #87CEEB",
                  mx: "auto",
                  mb: 2,
                  padding: "2px",
                  background: "linear-gradient(45deg, #87CEEB, #E0F7FA)",
                }}
              >
                <Avatar
                  src={user?.image}
                  alt="Profile"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>

              {/* User Info */}
              <CardContent
                sx={{
                  textAlign: "center",
                  p: 0,
                  flexGrow: 1, 
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box>
                  <Typography fontWeight="bold"  color={"#000"}>
                    {user.first_name} {user.last_name}{" "}
                  </Typography>
                  <Typography component="span" color="text.secondary">
                    {user.age || calculateAge(user.date_of_birth)} yrs
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={1}
                  gap={0.5}
                  
                >
                  <FaBriefcase size={14} />
                  <Typography variant="body2" color={"#000"}>
                    {user.occupation || "Not specified"}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mt={0.5}
                  gap={0.5}
                >
                  <FaMapMarkerAlt size={14} />
                  <Typography variant="body2" color={"#000"}>
                    {[user.city, user.state, user.country]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1, height:'1px' }} />

                {/* Additional Details */}
                <Box display="flex" justifyContent="space-around">
                  <DetailItem label="Height" value={user.height || "N/A"} />
                  <DetailItem label="Religion" value={user.religion || "N/A"} />
                  <DetailItem label="Caste" value={user.caste || "N/A"} />
                </Box>

                {/* Caste Preference */}
                {/* Caste Preference removed, backend handles preference filtering */}

                <Box sx={{  width: "100%" }}>
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
           )}
          )}
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e,page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            size={window.innerWidth < 600 ? "small" : "medium"}
          />
        </Box>
      )}

      {selectedUser && (
        <ProfileDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          selectedUser={selectedUser}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          loggedInUserId={registerNo}
          isLoading={false}
          renderDialogContent={renderDialogContent}
        />
      )}
       
    </Box>
  );
};

const DetailItem = ({ label, value }) => (
  <Box textAlign="center">
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle2" fontWeight="bold">
      {value}
    </Typography>
  </Box>
);

export default MyMatches;
