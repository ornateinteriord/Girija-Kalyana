import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Visibility, VisibilityOff, Email, Lock, Favorite } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation, useResetPasswordMutation } from "../api/Auth";
import useAuth from "../hook/UseAuth";
import TokenService from "../token/tokenService";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { openDialog } = location.state || {};

  const { mutate: login, isPending: isLoginPending } = useLoginMutation();
  const { mutate: resetPassword, isPending: isResettingPassword } = useResetPasswordMutation();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Both username and password are required");
      return;
    }
    login(loginData);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (openDialog) {
      setOpen(true);
    }
  }, [openDialog]);

  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
    setOtpSent(false);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordError("");
  };

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
    setOtpSent(false);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordError("");
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Service", path: "/service" },
    { text: "About Us", path: "/about" },
    { text: "Privacy Policy", path: "/privacy-policy" },
    { text: "Contact Us", path: "/contact" },
  ];

  const handleLogout = () => {
    navigate("/");
    TokenService.removeToken();
    window.dispatchEvent(new Event("storage"));
  };

  const handleSendOtp = () => {
    if (!email) {
      setForgotPasswordError("Email is required");
      return;
    }
    setForgotPasswordError("");

    resetPassword({ username: email }, {
      onSuccess: (response) => {
        if (response.success) {
          setOtpSent(true);
          toast.success("OTP sent successfully");
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to send OTP");
      }
    });
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setForgotPasswordError("Passwords do not match");
      return;
    }
    if (!otp || !newPassword || !confirmPassword) {
      setForgotPasswordError("All fields are required");
      return;
    }

    resetPassword({
      username: email,
      otp,
      newPassword,
    }, {
      onSuccess: () => {
        toast.success("Password reset successfully");
        handleCloseForgotPassword();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message);
      }
    });
  };

  return (
    <div className="navbar-main-container">
      <div className="navbar-container">
        <div className="navbar">
          {/* Mobile Menu Button */}
          <IconButton
            className="menu-button"
            onClick={toggleMobileMenu}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#fff",
            }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {/* Logo/Brand Name */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "1.5rem", md: "1.75rem" },
              whiteSpace: "nowrap",
              textDecoration: "none",
              color: "#fff",
              textAlign: 'center',
              [theme.breakpoints.up('md')]: {
                margin: "0",
                marginRight: "auto"
              }
            }}
          >
            Girija❤️Kalyana
          </Typography>

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexGrow: 1,
              justifyContent: "center",
              marginLeft: "20px"
            }}
          >
            {menuItems.map((item) => {
              // Get the current path (assuming you're using React Router)
              const currentPath = window.location.pathname;
              // Check if this item is active
              const isActive = currentPath === item.path;

              return (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "capitalize",
                    margin: "0 8px",
                    position: "relative",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "transparent",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "4px",
                        left: "8px",
                        right: "8px",
                        height: "2px",
                        backgroundColor: "#fff",
                        transform: "scaleX(1)",
                        transition: "transform 0.3s ease"
                      }
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "4px",
                      left: "8px",
                      right: "8px",
                      height: "2px",
                      backgroundColor: "#fff",
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transition: "transform 0.3s ease"
                    }
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isLoggedIn ? (
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                onClick={handleLogout}
                sx={{
                  backgroundColor: "black",
                  minWidth: "120px",
                  color: "#fff",
                  fontWeight: 700,
                  height: { xs: "36px", md: "42px" },
                  textTransform: "capitalize",
                  display: { xs: "none", sm: "inline-flex" },
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  onClick={handleOpen}
                  sx={{
                    backgroundColor: "#FFFF",
                    minWidth: "120px",
                    color: "#000",
                    fontWeight: 700,
                    height: { xs: "36px", md: "42px" },
                    textTransform: "capitalize",
                    display: { xs: "none", sm: "inline-flex" },
                    "&:hover": {
                      backgroundColor: "#eee",
                    },
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: "280px",
            background: '#1a4f72',
            color: "#fff",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              paddingBottom: "10px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
            >
              Girija❤️Kalyana
            </Typography>
            <IconButton onClick={toggleMobileMenu} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ padding: 0 }}>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                onClick={toggleMobileMenu}
                sx={{
                  padding: "8px 16px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Link
                  className="link mobile-link"
                  to={item.path}
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    color: "#fff",
                  }}
                >
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </Link>
              </ListItem>
            ))}
          </List>

          <Box sx={{ padding: "16px", marginTop: "auto" }}>
            {isLoggedIn ? (
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  fontWeight: 600,
                  height: "42px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#eee",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    handleOpen();
                    toggleMobileMenu();
                  }}
                  sx={{
                    backgroundColor: "#fff",
                    color: "#000",
                    fontWeight: 600,
                    height: "42px",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#eee",
                    },
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Login Dialog — Premium Redesign */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(26,79,114,0.25)",
          }
        }}
      >
        {/* Gradient Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1a4f72 0%, #2196f3 100%)",
            py: 3.5,
            px: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8, color: "rgba(255,255,255,0.7)" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              mb: 0.5,
            }}
          >
            <Favorite sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          {/* <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.5 }}>
            Welcome Back
          </Typography> */}
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)",fontSize:"1rem" }}>
            Sign in to your Girija❤️Kalyana account
          </Typography>
        </Box>

        <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              label="Email Address"
              name="username"
              value={loginData.username}
              onChange={handleChangeLogin}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#1a4f72", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&:hover fieldset": { borderColor: "#1a4f72" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1a4f72",
                    boxShadow: "0 0 0 3px rgba(26,79,114,0.1)",
                  },
                },
                "& label.Mui-focused": { color: "#1a4f72" },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={loginData.password}
              onChange={handleChangeLogin}
              type={showLoginPassword ? "text" : "password"}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#1a4f72", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowLoginPassword(!showLoginPassword)} edge="end" size="small">
                      {showLoginPassword
                        ? <VisibilityOff sx={{ fontSize: 20, color: "#999" }} />
                        : <Visibility sx={{ fontSize: 20, color: "#999" }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&:hover fieldset": { borderColor: "#1a4f72" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1a4f72",
                    boxShadow: "0 0 0 3px rgba(26,79,114,0.1)",
                  },
                },
                "& label.Mui-focused": { color: "#1a4f72" },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                textAlign: "right",
                color: "#1a4f72",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={handleOpenForgotPassword}
            >
              Forgot Password?
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, flexDirection: "column", gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            disabled={isLoginPending}
            sx={{
              height: "48px",
              borderRadius: "10px",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
              background: "linear-gradient(135deg, #1a4f72 0%, #2196f3 100%)",
              boxShadow: "0 4px 15px rgba(26,79,114,0.35)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #1565a0 0%, #1976d2 100%)",
                boxShadow: "0 6px 20px rgba(26,79,114,0.45)",
                transform: "translateY(-1px)",
              },
              "&:disabled": { background: "#ccc" },
            }}
          >
            {isLoginPending ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
            Don't have an account?{" "}
            <Box
              component="span"
              sx={{
                color: "#1a4f72", cursor: "pointer", fontWeight: 600,
                "&:hover": { textDecoration: "underline" }
              }}
              onClick={() => { handleClose(); navigate("/membership"); }}
            >
              Register here
            </Box>
          </Typography>
        </DialogActions>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog
        open={openForgotPassword}
        onClose={handleCloseForgotPassword}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(26,79,114,0.25)",
          }
        }}
      >
        {/* Gradient Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1a4f72 0%, #2196f3 100%)",
            py: 3,
            px: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseForgotPassword}
            sx={{ position: "absolute", top: 8, right: 8, color: "rgba(255,255,255,0.7)" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
            {otpSent ? "🔑 Reset Password" : "🔒 Forgot Password"}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            {otpSent ? "Enter your OTP and new password" : "We'll send an OTP to your email"}
          </Typography>
        </Box>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingTop: "16px",
            }}
          >
            {!otpSent ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Enter your registered email to receive a password reset OTP.
                </Typography>
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  Enter the OTP sent to your email and your new password.
                </Typography>
                <TextField
                  fullWidth
                  label="OTP"
                  variant="outlined"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  variant="outlined"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  variant="outlined"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </>
            )}
            {forgotPasswordError && (
              <Typography color="error" variant="body2" textAlign="center">
                {forgotPasswordError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "6px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={otpSent ? handleResetPassword : handleSendOtp}
            disabled={isResettingPassword}
            sx={{
              height: "44px",
              borderRadius: "8px",
              fontWeight: 500,
              textTransform: "capitalize",
              fontSize: "1rem",
              backgroundColor: '#1a4f72',
              "&:hover": {
                background: '#1a4f72'
              }
            }}
          >
            {isResettingPassword ? (
              <CircularProgress size={24} color="inherit" />
            ) : otpSent ? (
              "Reset Password"
            ) : (
              "Send OTP"
            )}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleCloseForgotPassword}
            sx={{
              height: "44px",
              mr: 1,
              mb: 2.5,
              borderRadius: "8px",
              fontWeight: 500,
              textTransform: "capitalize",
              fontSize: "1rem",
              "&:hover": {
                background: 'transparent'
              }
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Navbar;
