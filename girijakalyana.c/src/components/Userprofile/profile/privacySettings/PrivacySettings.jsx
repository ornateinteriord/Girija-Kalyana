import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { FaRegImage } from "react-icons/fa";
import {
  useGetMemberDetails,
  useUpdateProfile,
} from "../../../api/User";
import TokenService from "../../../token/tokenService";

const privacyOptions = [
  {
    label: "Display Photo",
    value: "enable",
    description: "Show your photo to all users",
  },
  {
    label: "Display Only to Paid Users",
    value: "Premiumuser",
    description: "Only visible to premium members",
  },
  {
    label: "Display Photo on Request",
    value: "requestuser",
    description: "Users must request to view your photo",
  },
];

const PrivacySettings = () => {
  const theme = useTheme();
  const registerNo = TokenService.getRegistrationNo();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: userProfile, isLoading } = useGetMemberDetails(registerNo);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  // Initialize state based on userProfile
  const [settings, setSettings] = useState({
    enable: false,
    Premiumuser: false,
    requestuser: false,
  });

  // Update state when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setSettings({
        enable: userProfile.secure_image === "enable",
        Premiumuser: userProfile.secure_image === "Premiumuser",
        requestuser: userProfile.secure_image === "requestuser",
      });
    }
  }, [userProfile]);

  const handleToggle = (option) => {
    const newSettings = {
      enable: false,
      Premiumuser: false,
      requestuser: false,
    };

    // Only allow one option to be selected at a time (radio button behavior)
    newSettings[option.value] = !settings[option.value];

    setSettings(newSettings);

    // Update the profile with the new secure_image value
    updateProfile({
      registration_no: registerNo,
      secure_image: newSettings[option.value] ? option.value : "disable",
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        padding:isMobile ? "0px" : "24px",
        maxWidth: "100%",
        margin: "auto",
        fontFamily: "Roboto, sans-serif",
        width: "100%",
       mt:2
      }}
    >
   

      <Typography variant="body1" sx={{ mb: 3, }}>
        {userProfile?.image_verification === "active" ? (
          <Box component="span" sx={{ color: "green",fontSize:isMobile ? "1rem" : "1.2rem" }}>
            Your photo is verified. Choose who can see it:
          </Box>
        ) : userProfile?.image ? (
          <Box component="span" sx={{ color: "orange",fontSize:isMobile ? "1rem" : "1.2rem" }}>
            Please verify your photo to access privacy settings.
          </Box>
        ) : (
          <Box component="span" sx={{ color: "red",fontSize:isMobile ? "1rem" : "1.2rem" }}>
            Please upload a profile photo to access privacy settings.
          </Box>
        )}
      </Typography>

      <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    width: "100%",
  }}
>
  <Box
    sx={{
      display: "grid",
      gap: "20px",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr",
        md: "1fr",
        lg: "1fr",
      },
    }}
  >
    {privacyOptions.map((option, index) => (
      <Box
        key={index}
        sx={{
          width:isMobile ? "100%" : "550px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: isMobile ? "6px" : "16px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "0.3s",
          opacity: userProfile?.image_verification === "active" ? 1 : 0.6,
          pointerEvents:
            userProfile?.image_verification === "active" ? "auto" : "none",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <FaRegImage size={isMobile ? 23 : 32} color="#1976d2" />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "15px", md: "18px" },
                color: "#555",
                fontWeight: 500,
              }}
            >
              {option.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#777",
                fontSize: "0.875rem",
              }}
            >
              {option.description}
            </Typography>
          </Box>
        </Box>

        <Switch
          checked={settings[option.value]}
          onChange={() => handleToggle(option)}
          color="primary"
          inputProps={{ "aria-label": option.label }}
          disabled={
            userProfile?.image_verification !== "active" || isUpdating
          }
        />
      </Box>
    ))}
  </Box>
</Box>

    </Box>
  );
};

export default PrivacySettings;
