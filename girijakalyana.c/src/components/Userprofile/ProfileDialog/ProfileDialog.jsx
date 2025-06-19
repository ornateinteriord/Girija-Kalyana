import React, { useEffect, useState } from "react";
import profileimg from "../../../assets/profile.jpg";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { useExpressInterest,} from "../../api/User/useGetProfileDetails";
import { get } from "../../api/authHooks";
import TokenService from "../../token/tokenService";
import MembershipDialog from "../MembershipDailog/MembershipDailog";
import {membershipOptions} from "../MembershipDailog/MemberShipPlans"
import Profileimage from '../../../assets/profile.jpg'

const ProfileDialog = ({
  openDialog,
  setOpenDialog,
  selectedUser,
  currentTab,
  setCurrentTab,
  loggedInUserId,
  isLoading,
  renderDialogContent,
}) => {
  const tabLabels = ["About", "Family", "Education", "LifeStyle", "Preference"];
  const [localInterestStatus, setLocalInterestStatus] = useState("none");
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [membershipDialogOpen, setMembershipDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const loggedInUserRole = TokenService.getRole();

  const fetchStatus = async () => {
    if (!loggedInUserRole || !loggedInUserId || !selectedUser?.registration_no) {
      setLocalInterestStatus("none");
      setIsStatusLoading(false);
      return;
    }

    setIsStatusLoading(true);
    try {
      const response = await get(
        `/api/user/interest/status/${loggedInUserId}/${selectedUser.registration_no}`
      );
        const payload = response.data;
        const status = payload?.status ?? "none";
    setLocalInterestStatus(status);
    } catch (error) {
      console.error("Error fetching interest status:", error);
    } finally {
      setIsStatusLoading(false);
    }
  };

  useEffect(() => {
    if (openDialog && loggedInUserRole&& loggedInUserId && selectedUser?.registration_no) {
      fetchStatus();
    }
  }, [openDialog,loggedInUserRole, loggedInUserId, selectedUser?.registration_no]);


  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };



  const getButtonState = () => {
    if (isStatusLoading) {
      return {
        color: "primary",
        text: "Loading...",
        disabled: true,
      };
    }
    if (loggedInUserRole === "FreeUser") {
      return {
        color: "gold", // This won't be used since we're using customStyle
        text: "Upgrade",
        disabled: false,
        isPremiumAction: true,
        customStyle: {
          textTransform: "none",
          background: "linear-gradient(45deg, #FFD700 0%, #D4AF37 100%)",
          color: "#000",
          fontWeight: "bold",
          "&:hover": {
            background: "linear-gradient(45deg, #D4AF37 0%, #FFD700 100%)",
          },
        },
      };
    }
    switch (localInterestStatus) {
      case "pending":
        return {
          color: "warning",
          text: "Request Sent",
          disabled: true,
        };
      case "accepted":
        return {
          color: "success",
          text: "Connected",
          disabled: true,
        };
      case "rejected":
        return {
          color: "error",
          text: "Rejected",
          disabled: true,
        };
      default:
        return {
          color: "primary",
          text: "Express Interest",
          disabled: false,
        };
    }
  };

  const buttonState = getButtonState();

  const expressInterestMutation = useExpressInterest();

  const handleButtonClick = () => {
  
  if (loggedInUserRole === "FreeUser") {
      setSelectedPlan(membershipOptions[1]); 
    setMembershipDialogOpen(true);

  } else if (!buttonState.disabled) {
    handleSendInterest();
  }
};

  const handleSendInterest = () => {
    expressInterestMutation.mutate(
      {
        sender: loggedInUserId,
        recipient: selectedUser.registration_no,
        message: "Expressed interest in you",
      },
      {
        onSuccess: () => {
          setLocalInterestStatus("pending");
          fetchStatus();
        },
        onError: (error) => {
          console.error("Error expressing interest:", error);
          fetchStatus();
        },
      }
    );
  };
  const handleConfirmPayment = () => {
    setMembershipDialogOpen(false);
  };

  return (
    <>
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      fullWidth
      maxWidth="lg"
      sx={{
        "& .MuiDialog-paper": {
          margin: { xs: "8px", sm: "16px" },
          width: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
          maxWidth: "1200px",
          maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          backgroundColor: "#f5f5f5",
          overflowY: "auto",
          maxHeight: { xs: "90vh", sm: "85vh" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, sm: 3 },
            p: { xs: 1.5, sm: 3 },
          }}
        >
          {/* Left side - Profile image and basic info */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              minWidth: { xs: "100%", md: "300px" },
            }}
          >
            <CardMedia
              component="img"
              src={selectedUser?.image || Profileimage}
              sx={{
                borderRadius: 2,
                height: { xs: 200, sm: 250, md: 280 },
                width: "100%",
                objectFit: "cover",
                maxWidth: { xs: "300px", md: "none" },
              }}
            />
            <Box textAlign="center" sx={{ width: "100%" }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
              >
                {selectedUser?.first_name} {selectedUser?.last_name}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                {selectedUser?.age || calculateAge(selectedUser?.date_of_birth)}{" "}
                yrs, {selectedUser?.height}
              </Typography>
              <Chip
                label={selectedUser?.user_role}
                color={
                  selectedUser?.user_role === "PremiumUser"
                    ? "primary"
                    : "default"
                }
                size="small"
                sx={{ mt: 1, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
              />
            </Box>
          </Box>

          {/* Right side - Tabbed content */}
          <Box
            sx={{
              flex: 2,
              minWidth: 0,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Tabs
              value={currentTab}
              onChange={(e, val) => setCurrentTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 2,
                "& .MuiTab-root": {
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  minWidth: "unset",
                  padding: { xs: "6px 8px", sm: "12px 16px" },
                   "&:hover": {
                     backgroundColor: "transparent", 
                   },
                },
              }}
            >
              {tabLabels.map((label, index) => (
                <Tab key={index} label={label} />
              ))}
            </Tabs>
            <Box
              sx={{
                p: { xs: 1, sm: 2 },
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 1,
                minHeight: { xs: 250, sm: 300 },
                maxHeight: { xs: "40vh", sm: "50vh", md: "60vh" },
                overflowY: "auto",
              }}
            >
              {renderDialogContent()}
            </Box>
          </Box>
        </Box>

        {/* Footer with action buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            p: { xs: 1.5, sm: 2 },
            backgroundColor: "white",
            borderTop: "1px solid #eee",
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box display="flex" alignItems="center" sx={{ mb: { xs: 1, sm: 0 } }}>
            <RiVerifiedBadgeFill
              style={{
                fontSize: { xs: 20, sm: 24 },
                color: "#1976d2",
                marginRight: 8,
              }}
            />
            <Typography
              variant="body1"
              fontWeight="bold"
              color="#000"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Verified Profile
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: { xs: "100%", sm: "auto" },
              "& button": {
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                padding: { xs: "6px 12px", sm: "8px 16px" },
              },
            }}
          >
            <Button
              variant="contained"
              color={buttonState.color}
              onClick={handleButtonClick}
              disabled={isLoading}
              startIcon={
                isLoading || isStatusLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <FaHeart />
                )
              }
              fullWidth={window.innerWidth < 600}
              sx={
                buttonState.customStyle || {
                  textTransform: "none",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  padding: { xs: "6px 12px", sm: "8px 16px" },
                }
              }
            >
              {buttonState.text}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(false)}
              fullWidth={window.innerWidth < 600}
              sx={{
                 "&:hover": {
        backgroundColor: "transparent", // transparent hover effect
      },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
    <MembershipDialog
  open={membershipDialogOpen}
  onClose={() => setMembershipDialogOpen(false)}
  selectedPlan={selectedPlan}
  onConfirm={handleConfirmPayment} 
/>
</>
  );
};

export default ProfileDialog;
