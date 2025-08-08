import { Box, CircularProgress, Typography } from "@mui/material";

export const isSilverOrPremiumUser = (role = " ") => {
  const normalizedRole = role.toLowerCase();
  return normalizedRole === "silveruser" || normalizedRole === "premiumuser";
};

export const LoadingTextSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 1,
        height: "50vh",
      }}
    >
      <CircularProgress size={60} color="#000" />
      <Typography color="#000">Loading...</Typography>
    </Box>
  );
};

export const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};
