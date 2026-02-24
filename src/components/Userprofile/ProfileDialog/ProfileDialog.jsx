import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";
import { useExpressInterest } from "../../api/User";
import { get } from "../../api/authHooks";
import TokenService from "../../token/tokenService";
import MembershipDialog from "../MembershipDailog/MembershipDailog";
import { membershipOptions } from "../MembershipDailog/MemberShipPlans";
import Profileimage from "../../../assets/profile.jpg";
import { calculateAge } from "../../../utils/common";
import AboutPop from "../viewAll/popupContent/abouPop/AboutPop";
import FamilyPop from "../viewAll/popupContent/familyPop/FamilyPop";
import EducationPop from "../viewAll/popupContent/educationPop/EducationPop";
import LifeStylePop from "../viewAll/popupContent/lifeStylePop/LifeStylePop";
import PreferencePop from "../viewAll/popupContent/preferencePop/PreferencePop";
import OthersPop from "../viewAll/popupContent/others/OthersPop";

const ProfileDialog = ({
  openDialog,
  setOpenDialog,
  selectedUser,
  currentTab,
  setCurrentTab,
  isLoading,
  isRequestTab = false,
}) => {
  const tabLabels = ["About", "Family", "Education", "LifeStyle", "Preference", "Others"];
  const [localInterestStatus, setLocalInterestStatus] = useState("none");
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [membershipDialogOpen, setMembershipDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const loggedInUserRole = TokenService.getRole();
  const loggedInUserId = TokenService.getRegistrationNo();

  const renderDialogContent = () => {
    if (!selectedUser) return null;
    const contentMap = {
      0: <AboutPop userDetails={selectedUser} />,
      1: <FamilyPop userDetails={selectedUser} />,
      2: <EducationPop userDetails={selectedUser} />,
      3: <LifeStylePop userDetails={selectedUser} />,
      4: <PreferencePop userDetails={selectedUser} />,
      5: <OthersPop userDetails={selectedUser} />,
    };
    return contentMap[currentTab] || null;
  };

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
    if (openDialog && loggedInUserRole && loggedInUserId && selectedUser?.registration_no) {
      fetchStatus();
    }
  }, [openDialog, loggedInUserRole, loggedInUserId, selectedUser?.registration_no]);

  const getButtonState = () => {
    if (isStatusLoading) {
      return { color: "primary", text: "Loading...", disabled: true };
    }
    if (loggedInUserRole === "FreeUser") {
      return {
        color: "gold",
        text: "Upgrade to Connect",
        disabled: false,
        isPremiumAction: true,
        customStyle: {
          textTransform: "none",
          background: "linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)",
          color: "#5a3800",
          fontWeight: 700,
          boxShadow: "0 4px 14px rgba(212,175,55,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)",
            boxShadow: "0 6px 20px rgba(212,175,55,0.45)",
            transform: "translateY(-1px)",
          },
        },
      };
    }
    switch (localInterestStatus) {
      case "pending":
        return { color: "warning", text: "Request Sent", disabled: true };
      case "accepted":
        return { color: "success", text: "Connected ✓", disabled: true };
      case "rejected":
        return { color: "error", text: "Rejected", disabled: true };
      default:
        return {
          color: "primary",
          text: "Express Interest",
          disabled: false,
          customStyle: {
            background: "linear-gradient(135deg, #1a4f72 0%, #2196f3 100%)",
            boxShadow: "0 4px 14px rgba(26,79,114,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #2196f3 0%, #1a4f72 100%)",
              boxShadow: "0 6px 20px rgba(26,79,114,0.45)",
              transform: "translateY(-1px)",
            },
          },
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

  // Membership chip styling
  const getMembershipChip = (type) => {
    if (type === "PremiumUser")
      return {
        label: "★ Premium",
        bg: "linear-gradient(135deg, #FFD700, #D4AF37)",
        color: "#5a3800",
      };
    if (type === "SilverUser")
      return {
        label: "◆ Silver",
        bg: "linear-gradient(135deg, #C0C0C0, #A8A8A8)",
        color: "#22272e",
      };
    return { label: "Free", bg: "#e8f4fd", color: "#1565c0" };
  };
  const chip = getMembershipChip(selectedUser?.type_of_user);

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
            maxWidth: "1100px",
            maxHeight: { xs: "calc(100% - 16px)", sm: "calc(100% - 32px)" },
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(26,79,114,0.2)",
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            background: "linear-gradient(135deg, #f0f6fc 0%, #e3f2fd 100%)",
            overflowY: "auto",
            maxHeight: { xs: "90vh", sm: "85vh" },
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
              "&:hover": { background: "#fff" },
            }}
          >
            <CloseIcon sx={{ fontSize: 20, color: "#1a4f72" }} />
          </IconButton>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 2, sm: 3 },
              p: { xs: 2, sm: 3 },
            }}
          >
            {/* ── Left Panel ── */}
            <Box
              sx={{
                flex: "0 0 auto",
                width: { xs: "100%", md: 270 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Photo card */}
              <Box
                sx={{
                  width: "100%",
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(26,79,114,0.1)",
                  overflow: "hidden",
                  border: "1px solid rgba(26,79,114,0.08)",
                }}
              >
                {/* Gradient top strip */}
                <Box
                  sx={{
                    height: 8,
                    background: "linear-gradient(90deg, #1a4f72, #2196f3, #64b5f6)",
                  }}
                />
                <Box sx={{ p: 2.5, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1a4f72, #64b5f6)",
                      p: "3px",
                      boxShadow: "0 4px 16px rgba(26,79,114,0.3)",
                      mb: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={selectedUser?.image || Profileimage}
                      sx={{
                        borderRadius: "50%",
                        width: { xs: 130, md: 150 },
                        height: { xs: 130, md: 150 },
                        objectFit: "cover",
                        display: "block",
                        border: "3px solid #fff",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1a1a1a", fontSize: { xs: "1.1rem", sm: "1.2rem" } }}
                  >
                    {selectedUser?.first_name} {selectedUser?.last_name}
                  </Typography>
                  <Typography
                    sx={{ color: "#666", fontSize: "0.88rem", mt: 0.25, mb: 1.25 }}
                  >
                    {selectedUser?.age || calculateAge(selectedUser?.date_of_birth)} yrs
                    {selectedUser?.height ? ` • ${selectedUser.height}` : ""}
                  </Typography>

                  <Chip
                    label={chip.label}
                    size="small"
                    sx={{
                      background: chip.bg,
                      color: chip.color,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      letterSpacing: "0.3px",
                      border: "none",
                      boxShadow:
                        selectedUser?.type_of_user === "PremiumUser"
                          ? "0 2px 8px rgba(212,175,55,0.35)"
                          : "none",
                    }}
                  />
                </Box>
              </Box>

              {/* Verified badge strip */}
              <Box
                sx={{
                  width: "100%",
                  background: "#fff",
                  borderRadius: "12px",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "0 2px 10px rgba(26,79,114,0.08)",
                  border: "1px solid rgba(26,79,114,0.08)",
                }}
              >
                <RiVerifiedBadgeFill style={{ fontSize: 20, color: "#1976d2", flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#1a1a1a" }}>
                  Verified Profile
                </Typography>
              </Box>
            </Box>

            {/* ── Right Panel ── */}
            <Box sx={{ flex: 2, minWidth: 0, width: { xs: "100%", md: "auto" } }}>
              {/* Tabs */}
              <Box
                sx={{
                  background: "#fff",
                  borderRadius: "12px",
                  mb: 2,
                  boxShadow: "0 2px 10px rgba(26,79,114,0.08)",
                  border: "1px solid rgba(26,79,114,0.08)",
                  overflow: "hidden",
                }}
              >
                <Tabs
                  value={currentTab}
                  onChange={(e, val) => setCurrentTab(val)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#1a4f72",
                      height: 3,
                      borderRadius: "3px 3px 0 0",
                    },
                    "& .MuiTab-root": {
                      fontSize: { xs: "0.72rem", sm: "0.82rem" },
                      minWidth: "unset",
                      padding: { xs: "10px 12px", sm: "12px 18px" },
                      textTransform: "none",
                      fontWeight: 500,
                      color: "#666",
                      "&.Mui-selected": {
                        color: "#1a4f72",
                        fontWeight: 700,
                      },
                      "&:hover": {
                        backgroundColor: "rgba(26,79,114,0.05)",
                        color: "#1a4f72",
                      },
                    },
                  }}
                >
                  {tabLabels.map((label, index) => (
                    <Tab key={index} label={label} />
                  ))}
                </Tabs>
              </Box>

              {/* Tab content */}
              <Box
                sx={{
                  p: { xs: 1.5, sm: 2.5 },
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(26,79,114,0.08)",
                  border: "1px solid rgba(26,79,114,0.08)",
                  minHeight: { xs: 220, sm: 280 },
                  maxHeight: { xs: "38vh", sm: "48vh", md: "55vh" },
                  overflowY: "auto",
                }}
              >
                {renderDialogContent()}
              </Box>
            </Box>
          </Box>

          {/* ── Footer Action Bar ── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
              alignItems: "center",
              px: { xs: 2, sm: 3 },
              py: 2,
              background: "#fff",
              borderTop: "1px solid rgba(26,79,114,0.1)",
              gap: 1.5,
            }}
          >
            {loggedInUserId !== selectedUser?.registration_no && !isRequestTab && (
              <Button
                variant="contained"
                onClick={handleButtonClick}
                disabled={isLoading || buttonState.disabled}
                startIcon={
                  isLoading || isStatusLoading
                    ? <CircularProgress size={18} color="inherit" />
                    : <FaHeart />
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "10px",
                  px: 3,
                  py: 1,
                  fontSize: { xs: "0.85rem", sm: "0.92rem" },
                  transition: "all 0.25s ease",
                  width: { xs: "100%", sm: "auto" },
                  ...buttonState.customStyle,
                }}
              >
                {buttonState.text}
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={() => setOpenDialog(false)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "10px",
                px: 3,
                py: 1,
                fontSize: { xs: "0.85rem", sm: "0.92rem" },
                color: "#1a4f72",
                borderColor: "rgba(26,79,114,0.3)",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  borderColor: "#1a4f72",
                  background: "rgba(26,79,114,0.04)",
                },
              }}
            >
              Close
            </Button>
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
