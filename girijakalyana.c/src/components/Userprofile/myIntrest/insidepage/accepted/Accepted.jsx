import  { useCallback, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Pagination,
  Avatar,
  Divider,
  Chip
} from "@mui/material";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import TokenService from "../../../../token/tokenService";
import { useGetAcceptedInterests } from "../../../../api/User/useGetProfileDetails";
import { LoadingComponent } from "../../../../../App";
import ProfileDialog from "../../../ProfileDialog/ProfileDialog";
import AboutPop from "../../../viewAll/popupContent/abouPop/AboutPop";
import FamilyPop from "../../../viewAll/popupContent/familyPop/FamilyPop";
import EducationPop from "../../../viewAll/popupContent/educationPop/EducationPop";
import LifeStylePop from "../../../viewAll/popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "../../../viewAll/popupContent/preferencePop/PreferencePop";
import { useVerifiedImage } from "../../../../hook/ImageVerification";
import { useConnectionStatus } from "../../../../hook/ConnectionStatus";

const ProfileInfo = ({ label, value }) => (
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="body2" fontWeight="bold">{label}</Typography>
    <Typography variant="body2" color="text.secondary">{value}</Typography>
  </Box>
);

const Accepted = () => {
  const registrationNo = TokenService.getRegistrationNo();
  const loggedInUserRole = TokenService.getRole()
  const { data: responseData, isLoading } = useGetAcceptedInterests(registrationNo);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const {getVerifiedImage} = useVerifiedImage()
  const { getConnectionStatus } = useConnectionStatus(responseData);

  const allAccepted = Array.isArray(responseData)
    ? responseData.filter(item => item?.status === "accepted")
    : [];

  const totalItems = allAccepted.length;

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allAccepted.slice(indexOfFirstItem, indexOfLastItem);

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
      4: <PreferencePop userDetails={selectedUser} />
    };
    return contentMap[currentTab] || null;
  };

   

  return (
    <Box sx={{ padding: 3 }}>
      {isLoading ? (
        <LoadingComponent />
      ) : totalItems === 0 ? (
        <Typography variant="h6" textAlign="center" mt={4}>
          No accepted interests found
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentItems.map((item, index) => {
              const profile = item.sender || {};
              const connectionStatus = getConnectionStatus(profile.registration_no);
               const imageSrc = getVerifiedImage(profile, loggedInUserRole, connectionStatus);
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      width: 270,
                      maxWidth: 320,
                      height: "100%",
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
                      alignItems: "center",
                      pt: 1,
                      position: "relative",
                    }}
                  >
                    {profile.user_role === "PremiumUser" && (
                      <Chip
                        label="PREMIUM"
                        color="primary"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                        }}
                      />
                    )}

                    <Box
                         sx={{
                           width: { xs: 100, sm: 120 },
                           height: { xs: 100, sm: 120 },
                           borderRadius: "50%",
                           border: "3px solid #87CEEB",
                           boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                           padding: "2px",
                           background: "linear-gradient(45deg, #87CEEB, #E0F7FA)",
                         }}
                       >
                      <Avatar
                        src={imageSrc}
                        alt={profile.first_name}
                        sx={{ width: "100%", height: "100%" }}
                      />
                    </Box>

                    <CardContent sx={{ width: "100%", textAlign: "center", px: 2 }}>
                      <Typography fontWeight="bold" gutterBottom>
                        {profile.first_name} {profile.last_name}
                      </Typography>
                      <Typography color="text.secondary">
                        {profile.age || "N/A"} yrs
                      </Typography>

                      <Box
                        sx={{ display: "flex",alignItems:'center', justifyContent: "center", gap: 1, mt: 1 }}
                      >
                        <FaBriefcase size={14} color="#777" />
                        <Typography variant="body2" color="text.secondary">
                          {profile.occupation || "Not specified"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex",alignItems:'center', justifyContent: "center", gap: 1, mt: 1 }}
                      >
                        <FaMapMarkerAlt size={14} color="#777" />
                        <Typography variant="body2">
                          {[profile.city, profile.state, profile.country]
                            .filter(Boolean)
                            .join(", ") || "Location not specified"}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 1}} />

                      <Box display="flex" justifyContent="space-around" mb={2}>
                        <ProfileInfo label="Height" value={profile.height || "N/A"} />
                        <ProfileInfo label="Religion" value={profile.religion || "N/A"} />
                        <ProfileInfo label="Caste" value={profile.caste || "N/A"} />
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenDialog(profile)}
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          textTransform: "none",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              marginTop: 4,
            }}
          >
            <Pagination
              count={Math.ceil(totalItems / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
            />
          </Box>
        </>
      )}

      {selectedUser && (
        <ProfileDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          selectedUser={selectedUser}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          loggedInUserId={registrationNo}
          isLoading={false}
          renderDialogContent={renderDialogContent}
        />
      )}
    </Box>
  );
};

export default Accepted;
