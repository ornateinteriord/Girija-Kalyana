import {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
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

import { useGetAllUsersProfiles } from "../../api/User/useGetProfileDetails";
import TokenService from "../../token/tokenService";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import GenderFilter from "../../../utils/Filters/GenderFilter";
import AboutPop from "./popupContent/abouPop/AboutPop";
import FamilyPop from "./popupContent/familyPop/FamilyPop";
import EducationPop from "./popupContent/educationPop/EducationPop";
import LifeStylePop from "./popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "./popupContent/preferencePop/PreferencePop";
import { isSilverOrPremiumUser, LoadingTextSpinner } from "../../../utils/common";

const itemsPerPage = 8;

const ViewAll = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const loggedInUserId = TokenService.getRegistrationNo();

  const {
    mutate: fetchProfiles,
    data,
    isPending: isLoading,
  } = useGetAllUsersProfiles();

  const handleStatusChange = useCallback((value) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchProfiles({ page: currentPage - 1, pageSize: itemsPerPage });
  }, [currentPage, selectedStatus, fetchProfiles]);

  const filteredUsers = useMemo(() => {
    if (!data?.content) return [];

    return data.content.filter((user) => {
      if (user.user_role === "Admin") return false;
      if (selectedStatus !== "all" && user.gender !== selectedStatus)
        return false;
      return true;
    });
  }, [data, selectedStatus]);

  const totalPages = useMemo(() => {
    return data ? Math.ceil(data.totalRecords / itemsPerPage) : 1;
  }, [data]);

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
        {isSilverOrPremiumUser(user?.type_of_user) && (
          <Chip
            label="PREMIUM"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: "bold",
              fontSize: { xs: "0.6rem", sm: "0.7rem" },
              backgroundColor: "#FFD700",
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
              width: { xs: 100, sm: 120, md: 110, lg: 120 },
              height: { xs: 100, sm: 120, md: 110, lg: 120 },
              borderRadius: "50%",
              border: "3px solid #87CEEB",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              mb: 2,
              position: "relative",
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
        </Box>

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            px: { xs: 1, sm: 2 },
            pt: 0,
            pb: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 0.5 }}>
            <Typography fontWeight="bold" color="#000" sx={{ fontSize: "1rem" }}>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography color="text.secondary">{age || "N/A"} yrs</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 0.5,
            }}
          >
            <FaBriefcase size={14} color="#000" style={{ marginRight: 6 }} />
            <Typography variant="body2" color="#000">
              {user.occupation || "Not specified"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <FaMapMarkerAlt size={14} color="#000" style={{ marginRight: 6 }} />
            <Typography variant="body2" color="#000">
              {[user.city, user.state, user.country]
                .filter(Boolean)
                .join(", ") || "Location not specified"}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-around" my={2}>
            <ProfileInfo label="Height" value={user.height || "N/A"} />
            <ProfileInfo label="Religion" value={user.religion || "N/A"} />
            <ProfileInfo label="Caste" value={user.caste || "N/A"} />
          </Box>

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
    <Box sx={{ p: { xs: 1, sm: 2 }, backgroundColor: "#f9f9f9" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
        >
          Profiles
        </Typography>

        <GenderFilter
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
        />
      </Box>

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
        {filteredUsers.map(renderUserCard)}
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

      {totalPages > 1 && (
        <Box display="flex" justifyContent="end" my={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            shape="rounded"
            size={window.innerWidth < 600 ? "small" : "medium"}
          />
        </Box>
      )}

      {isLoading && <LoadingTextSpinner />}
    </Box>
  );
};

const ProfileInfo = ({ label, value }) => (
  <Box textAlign="center" sx={{ px: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle2" fontWeight="bold">
      {value}
    </Typography>
  </Box>
);

export default ViewAll;
