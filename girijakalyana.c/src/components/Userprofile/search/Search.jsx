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
  TextField,
  CircularProgress,
} from "@mui/material";
import { FaMapMarkerAlt, FaBriefcase, FaSearch } from "react-icons/fa";
import { useGetAllUsersProfiles, useGetSearchProfiles } from "../../api/User/useGetProfileDetails";
import TokenService from "../../token/tokenService";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import AboutPop from "../viewAll/popupContent/abouPop/AboutPop";
import FamilyPop from "../viewAll/popupContent/familyPop/FamilyPop";
import EducationPop from "../viewAll/popupContent/educationPop/EducationPop";
import LifeStylePop from "../viewAll/popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "../viewAll/popupContent/preferencePop/PreferencePop";
import { LoadingComponent } from "../../../App";
import { isSilverOrPremiumUser, LoadingTextSpinner } from "../../../utils/common";
import OthersPop from "../viewAll/popupContent/others/OthersPop";

const itemsPerPage = 8;



const ProfileInfo = ({ label, value }) => (
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="body2" fontWeight="bold" color="#000">
      {label}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {value}
    </Typography>
  </Box>
);

const Search = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { data = [], isFetching,refetch,isError, } = useGetSearchProfiles(searchTerm);
  const loggedInUserId = TokenService.getRegistrationNo();

  const handleSearch = () => {
   refetch()
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  const paginatedUsers = useMemo(() => {
    return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [data, currentPage]);

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
      5: <OthersPop userDetails={selectedUser} />
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
          borderRadius: 4,
          boxShadow: 3,
          overflow: "hidden",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
          mx: "auto",
          position: "relative",
        }}
      >
        {isSilverOrPremiumUser(user?.type_of_user) && (
          <Chip
            label="PREMIUM"
            size="small"
            sx={{
            backgroundColor:"#FFD700",
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: "bold",
              fontSize: { xs: "0.6rem", sm: "0.7rem" },
            }}
          />
        )}
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
              width: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 },
              borderRadius: "50%",
              border: "3px solid #87CEEB",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              mb: 2,
              background: "linear-gradient(45deg, #87CEEB, #E0F7FA)",
              padding: "2px",
            }}
          >
            <Avatar
              src={user?.image}
              alt="Profile"
              sx={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Box>

        <CardContent
          sx={{
            px: { xs: 1, sm: 2 },
            pt: 0,
            pb: 2,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 0.5 }}>
            <Typography fontWeight="bold" color="#000" fontSize="1rem">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography color="text.secondary">{age || "N/A"} yrs</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center",justifyContent:'center', mb: 0.5 }}>
            <FaBriefcase size={14} color="#000" style={{ marginRight: 6 }} />
            <Typography variant="body2" color="#000">
              {user.occupation || "Not specified"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center",justifyContent:'center', mb: 1 }}>
            <FaMapMarkerAlt size={14} color="#000" style={{ marginRight: 6 }} />
            <Typography variant="body2" color="#000">
              {[user.city, user.state].filter(Boolean).join(", ") || "Location not specified"}
            </Typography>
          </Box>

          <Divider sx={{ my: 1, height:'1px'}} />

          <Box display="flex" justifyContent="space-around" my={2}>
            <ProfileInfo label="Height" value={user.height || "N/A"} />
            <ProfileInfo label="Religion" value={user.religion || "N/A"} />
            <ProfileInfo label="Caste" value={user.caste || "N/A"} />
          </Box>

          <Box mt="auto">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog(user)}
              sx={{ borderRadius: 2, py: 1, fontWeight: "bold" ,textTransform:'capitalize'}}
            >
              View More
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, backgroundColor: "#f9f9f9" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#1a4f72" }}>
          Search Results
        </Typography>

        <Box display="flex" gap={1} width={{ xs: "100%", sm: "70%" }}>
          <TextField
            size="medium"
            fullWidth
            variant="outlined"
            placeholder="Search by name, email, or registeration number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={isSearching || isFetching || !searchTerm.trim()}
            sx={{ 
              whiteSpace: "nowrap", 
              textTransform: "capitalize", 
              width: "150px", 
              fontSize: "18px",
              position: 'relative'
            }}
          >
           
                <FaSearch style={{ marginRight: 6 }} />
                Search
          </Button>
        </Box>
      </Box>

      {isSearching || isFetching ? (
        <LoadingTextSpinner />
      ) : (
        <>
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
            }}
          >
            {paginatedUsers.map(renderUserCard)}
          </Box>

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

          {data.length > 0 && (
            <Box display="flex" justifyContent="end" my={3}>
              <Pagination
                count={Math.ceil(data.length / itemsPerPage)}
                page={currentPage}
                shape="rounded"
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}

          {/* Show message if no results found */}
          {isError && data.length === 0 && (
            <Box mt={4} textAlign="center">
              <Typography color="red">No users found matching the input</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Search;