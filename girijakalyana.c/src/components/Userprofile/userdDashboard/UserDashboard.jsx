import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Stack,
  Typography,
  CircularProgress,
  Pagination,
  useMediaQuery,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import TokenService from "../../token/tokenService";
import HomeUserTable from "../../userupgrade/HomeUserTable";
import { useGetConnections, useGetMemberDetails } from "../../api/User/useGetProfileDetails";
import { LoadingComponent, } from "../../../App";
import { isSilverOrPremiumUser, LoadingTextSpinner } from "../../../utils/common";
import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
import AboutPop from "../viewAll/popupContent/abouPop/AboutPop";
import FamilyPop from "../viewAll/popupContent/familyPop/FamilyPop";
import EducationPop from "../viewAll/popupContent/educationPop/EducationPop";
import LifeStylePop from "../viewAll/popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "../viewAll/popupContent/preferencePop/PreferencePop";
import OthersPop from "../viewAll/popupContent/others/OthersPop";
import ProfileDialog from "../ProfileDialog/ProfileDialog";
import PageTitle from "../../PageTitle";

const UserDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const itemsPerPage = 8; 
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const registerNo = TokenService.getRegistrationNo();
  
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
  } = useGetMemberDetails(registerNo);

  const {
    mutate: fetchConnections,
    data: connectionsData = {},
    isPending: isLoadingConnections,
    isError: isConnectionsError,
    error: connectionsError,
  } = useGetConnections();

useEffect(() => {
  fetchConnections({ 
    page: currentPage, 
    pageSize: itemsPerPage, 
    userId: registerNo 
  });
}, [currentPage, registerNo, fetchConnections]);


  useEffect(() => {
    if (isProfileError) toast.error(profileError.message);
    if (isConnectionsError) toast.error(connectionsError.message);
  }, [isProfileError, profileError, isConnectionsError, connectionsError]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

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

  if (isLoadingProfile) return <LoadingComponent />;

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
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          fontWeight="bold"
          color="#212121"
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
        <Typography color="#424242">({userProfile?.registration_no})</Typography>
        <Divider sx={{ mt: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
      </Box>

      <Stack spacing={3}>
        {!isSilverOrPremiumUser(userProfile?.type_of_user) && (
          <Box sx={{ 
            width: "100%",
            overflowX: isSmallScreen ? "auto" : "visible",
          }}>
            <HomeUserTable />
          </Box>
        )}

        <Box>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            flexDirection={isSmallScreen ? "column" : "row"}
            gap={isSmallScreen ? 1 : 0}
            mb={2}
          >
            <PageTitle title="Interested Profiles" />
           {!isLoadingConnections && (
  <Typography variant="body2" color="#616161">
    Showing {connectionsData?.connections?.length || 0} of {connectionsData?.totalRecords || 0} connections
  </Typography>
)}

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
    minHeight: 300,
  }}
>
 {isLoadingConnections ? (
  <Box sx={{ gridColumn: "1 / -1", textAlign: "center" }}>
    <LoadingTextSpinner />
  </Box>
  ) : connectionsData?.connections?.length > 0 ? (
    connectionsData.connections.map((connection) => (
      <ProfileCard 
        key={connection._id}
        profile={connection.profile} 
        isSmallScreen={isSmallScreen}
        connection={connection}
        handleOpenDialog={handleOpenDialog}
      />
    ))
  ) : (
    <Box sx={{ gridColumn: "1 / -1" }}>
      <Typography
        sx={{
          color: "#212121",
          fontSize: "17px",
          fontWeight: "bold",
          textAlign: "center",
          width: "100%",
        }}
      >
        No connections yet. Send or accept interest requests to see connections here.
      </Typography>
    </Box>
  )}
</Box>

          <Box display="flex" justifyContent="end" mt={3}>
            <Pagination
              count={Math.ceil((connectionsData?.totalRecords || 0) / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size={isSmallScreen ? "small" : "medium"}
              sx={{
                visibility: connectionsData?.totalRecords > 0 ? 'visible' : 'hidden'
              }}
            />
          </Box>
        </Box>
      </Stack>

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

const ProfileCard = ({ profile, isSmallScreen, connection, handleOpenDialog }) => {
  return (
    <Card
      sx={{
        width: "100%",
    maxWidth: { xs: 300, sm: 280, md: 260, lg: 280 },
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
      {connection && (
        <Box 
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: connection.direction === 'sent' ? '#1976d2' : '#4caf50',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid white',
            zIndex: 1,
          }}
          title={connection.direction === 'sent' ? 'You sent this request' : 'You accepted this request'}
        >
          {connection.direction === 'sent' ? '→' : '←'}
        </Box>
      )}

      {isSilverOrPremiumUser(profile?.type_of_user) && (
        <Chip
          label="PREMIUM"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            backgroundColor: "#FFD700",
            zIndex: 1,
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
            src={profile?.image}
            alt="Profile"
            sx={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              backgroundColor: "#e0e0e0"
            }}
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
            {profile?.first_name || "N/A"} {profile?.last_name || ""}
          </Typography>
          <Typography color="text.secondary">
            {profile?.age || "N/A"} yrs
          </Typography>
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
            {profile?.occupation || "Not specified"}
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
            {[profile?.city, profile?.state, profile?.country]
              .filter(Boolean)
              .join(", ") || "Location not specified"}
          </Typography>
        </Box>
        

        <Divider sx={{ my: 1, height: '1px' }} />

        <Box display="flex" justifyContent="space-around" my={1}>
          <ProfileInfo label="Height" value={profile?.height || "N/A"} />
          <ProfileInfo label="Religion" value={profile?.religion || "N/A"} />
          <ProfileInfo label="Caste" value={profile?.caste || "N/A"} />
        </Box>
        
      <Box sx={{ mt: "auto", width: "100%" }}>
  <Button
    variant="contained"
    color="primary"
    onClick={() => handleOpenDialog(profile)}
    sx={{
      borderRadius: 2,
      py: 1,
      textTransform: "none",
      fontWeight: "bold",
      width: '100%',  
      maxWidth: '100%',
    }}
  >
    View More
  </Button>
</Box>

      </CardContent>
    </Card>
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

export default UserDashboard;