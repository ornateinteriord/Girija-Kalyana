import { Box, Typography, Button, Paper, Avatar, Fade, Stack, useMediaQuery, useTheme, Link } from "@mui/material";
import {  useNavigate } from "react-router-dom";
import { CheckCircleOutline, HourglassEmpty, MailOutline, Upgrade } from "@mui/icons-material";
import TokenService from "../token/tokenService";
import MembershipDialog from "../Userprofile/MembershipDailog/MembershipDailog";
import { useEffect, useState } from "react";


const ActivationPending = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
  const handleBackNavigation = () => {
    TokenService.removeToken();           
    window.dispatchEvent(new Event("storage")); 
  };
  window.addEventListener("popstate", handleBackNavigation);
  return () => {
    window.removeEventListener("popstate", handleBackNavigation);
  };
}, []);

  const handleLogout = () => {
  TokenService.removeToken();           
  window.dispatchEvent(new Event("storage")); 
  navigate("/");                         
};

  const handleUpgrade = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const role = TokenService.getRole();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: isMobile ? 2 : 3,
      }}
    >
      <Fade in={true} timeout={500}>
        <Paper
          elevation={6}
          sx={{
            p: isMobile ? 2 : 3,
            borderRadius: 3,
            maxWidth: 450, 
            width: "100%",
            textAlign: "center",
            background: "white",
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #3f51b5, #2196f3)",
            },
          }}
        >
          <Avatar
            sx={{
              width: isMobile ? 50 : 60,
              height: isMobile ? 50 : 60,
              bgcolor: "#3f51b5",
              mb: 2,
              mx: "auto",
            }}
          >
            <HourglassEmpty fontSize={isMobile ? "small" : "medium"} />
          </Avatar>

          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: "#3f51b5",
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}
          >
            Welcome to GirijaKalyana!
          </Typography>

          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              color: "#555", 
              mb: 2,
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            Your account is under verification
          </Typography>

          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "flex-start", 
              mb: 2,
              p: isMobile ? 1 : 1.5,
              bgcolor: "#f5f7fa",
              borderRadius: 1.5,
              textAlign: "left",
            }}
          >
            <CheckCircleOutline 
              color="primary" 
              sx={{ 
                mr: 1.5, 
                mt: 0.5, 
                fontSize: isMobile ? "0.875rem" : "1rem" 
              }} 
            />
            <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8125rem' : '0.875rem' }}>
              Thank you for registering! We're reviewing your application.
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "flex-start", 
              mb: 3,
              p: isMobile ? 1 : 1.5,
              bgcolor: "#f5f7fa",
              borderRadius: 1.5,
              textAlign: "left",
            }}
          >
            <MailOutline 
              color="primary" 
              sx={{ 
                mr: 1.5, 
                mt: 0.5, 
                fontSize: isMobile ? "0.875rem" : "1rem" 
              }} 
            />
            <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8125rem' : '0.875rem' }}>
              You'll receive an email once your account is activated (1-2 business days).
            </Typography>
          </Box>

          <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
            {role === "FreeUser" && (
              <Button
                fullWidth={isMobile}
                variant="contained"
                color="success"
                startIcon={<Upgrade sx={{ fontSize: isMobile ? '1rem' : '1.2rem' }} />}
                onClick={handleUpgrade}
                sx={{
                  maxWidth: "100%",
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                  },
                  transition: "all 0.3s ease",
                  py: isMobile ? 1 : 1.5,
                  fontSize: isMobile ? '0.8125rem' : '0.9375rem'
                }}
              >
                Upgrade Your Membership
              </Button>
            )}
            
            <Button
              fullWidth={isMobile}
              variant="contained"
              onClick={handleLogout}
              sx={{
                width:"100%",
                maxWidth: "100%",
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                background: "linear-gradient(90deg, #3f51b5, #2196f3)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
                },
                transition: "all 0.3s ease",
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '0.8125rem' : '0.9375rem'
              }}
            >
              Return to Home Page
            </Button>
          </Stack>

         <Typography
  variant="caption"
  display="block"
  sx={{ 
    mt: 2, 
    color: "#777", 
    fontSize: isMobile ? '0.65rem' : '0.7rem' 
  }}
>
  Need help? Contact{" "}
  <Link
    href="mailto:ornateinteriord@gmail.com?subject=Help%20Request"
    target="_blank"
    rel="noopener noreferrer"
    underline="always"
    sx={{
      color: "#4dabf7",
      fontSize: isMobile ? '0.65rem' : '0.7rem',
      cursor: 'pointer'
    }}
  >
    ornateinteriord@gmail.com
  </Link>
</Typography>
        </Paper>
      </Fade>
      
      <MembershipDialog
        open={open}
        onClose={handleClose}
        selectedPlan={selectedPlan}
      />
    </Box>
  );
};

export default ActivationPending;