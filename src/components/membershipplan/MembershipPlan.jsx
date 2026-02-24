import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Container,
  useTheme,
  useMediaQuery,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  CreditCard,
  Shield,
  VerifiedUser,
  CheckCircle,
  Star,
  Favorite,
  Lock,
  Public,
  PhoneAndroid,
  Close as CloseIcon
} from '@mui/icons-material';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { membershipOptions } from "../../assets/memberShipOptions/MemberShipPlans";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { post } from '../api/authHooks'; // Assuming this is where your API calls are
import MembershipUpgradeCards from '../common/MembershipUpgradeCards';

const MembershipPlans = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [promocodeDialogOpen, setPromocodeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [promocode, setPromocode] = useState(''); // Store applied promocode
  const [isChecking, setIsChecking] = useState(false);
  const [isPromoApplied, setIsPromoApplied] = useState(false); // Track if promocode is applied
  const [appliedPromocodePlan, setAppliedPromocodePlan] = useState(null); // Track which plan the promocode was applied to

  const benefits = [
    { icon: <Star color="primary" />, text: 'Premium quality matches' },
    { icon: <Favorite color="error" />, text: 'Higher response rates' },
    { icon: <Lock color="warning" />, text: 'Enhanced privacy controls' },
    { icon: <Public color="info" />, text: 'Nationwide reach' },
    { icon: <PhoneAndroid color="success" />, text: 'Dedicated mobile app' }
  ];

  const handlePlanSelection = (planName) => {
    const planRoles = {
      'PREMIUM MEMBERSHIP': 'PremiumUser',
      'SILVER MEMBERSHIP': 'SilverUser'
    };

    const planType = planRoles[planName] || 'FreeUser';
    // If promocode is applied, include it in the navigation
    const promocodeParam = isPromoApplied && promocode ? `&promocode=${promocode}` : '';
    navigate(`/register?type=${planType}${promocodeParam}`);
  };

  const handlePromocodeClick = (plan) => {
    setSelectedPlan(plan);
    // Clear any existing promocode when opening dialog
    setPromocode('');
    setPromocodeDialogOpen(true);
  };

  const handleApplyPromocode = async () => {
    if (!promocode.trim()) {
      toast.error('Please enter a promocode');
      return;
    }

    setIsChecking(true);
    try {
      const response = await post("/api/promoter/promocheck", {
        promocode: promocode.trim(),
      });

      if (response?.success) {
        toast.success(response.message || "Promocode applied successfully! ₹100 discount applied.");
        // Store the applied promocode and mark as applied
        setIsPromoApplied(true);
        setAppliedPromocodePlan(selectedPlan?.name); // Track which plan the promocode was applied to
        // Close the dialog and keep the promocode in state
        // Don't navigate - let the user click "Get Started" to proceed
        setPromocodeDialogOpen(false);
      } else {
        toast.error(response?.message || "Invalid promocode");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      toast.error(errorMessage || "Invalid promocode");
    } finally {
      setIsChecking(false);
    }
  };

  const handleCloseDialog = () => {
    setPromocodeDialogOpen(false);
    // Don't reset promocode or isPromoApplied state when closing dialog
    // This allows users to see the applied promocode
    setSelectedPlan(null);
  };

  // Handle plan selection from MembershipUpgradeCards
  const handlePlanSelect = (plan) => {
    handlePlanSelection(plan.name);
  };

  return (
    <>
      <Navbar />
      <Box sx={{
        background: '#ffff',
        minHeight: '100vh',
        py: isMobile ? 5.5 : 6
      }}>
        <Box width={'100%'} padding={'20px'}>
          <Typography
            component="h4"
            sx={{
              fontSize: isMobile ? "28px" : "40px",
              textAlign: 'left',
              mt: 1,
              mb: isMobile ? 1 : 3,
              fontWeight: 500,
              color: theme.palette.primary.main,
              background: '#1a4f72',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Find Your Perfect Match
          </Typography>
          <Divider sx={{
            height: '1px', my: 1
          }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 4,
              mt: 0,
            }}
          >
            {/* Left Side - Description Container */}
            <Box
              sx={{
                flex: isMobile ? '1 1 100%' : '0 0 33%',
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  mt: isMobile ? 2 : 6,
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #ffffff, #f5f5ff)',
                  borderLeft: `6px solid ${theme.palette.primary.main}`,
                  height: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontSize: isMobile ? "16px" : "23px",
                    mb: 0,
                    fontWeight: 500,
                    color: '#1a4f72',
                    textAlign: 'left',
                  }}
                >
                  Why Choose Our Membership?
                </Typography>

                <List>
                  {benefits.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                      <Typography variant="body1" color='#000'>{item.text}</Typography>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ height: '1px', my: isMobile ? 1 : 1 }} />

                <Typography variant="body1" sx={{ mb: 2, textAlign: 'start', color: '#000' }}>
                  Our membership plans are designed to help you find your perfect match with premium features and exclusive benefits.
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#f0f4ff',
                    border: `1px dashed ${theme.palette.primary.light}`,
                  }}
                >
                  <Typography variant="body2" color='#000' textAlign="center">
                    "Join thousands of happy couples who found their life partners through our platform."
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Right Side - Membership Plans */}
            <Box
              sx={{
                flex: isMobile ? '1 1 100%' : '0 0 67%',
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  textAlign: isMobile ? 'center' : 'left',
                  fontSize: isMobile ? "27px" : "30px",
                  mb: 2,
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  textTransform: 'capitalize'
                }}
              >
                Membership Plans
              </Typography>

              <MembershipUpgradeCards
                onPlanSelect={handlePlanSelect}
                onPromocodeApply={(promocodeData) => {
                  // Handle promocode apply if needed
                  console.log("Promocode applied:", promocodeData);
                }}
                appliedPromocode={isPromoApplied ? { promocode, isValid: true, discount: 100, planId: appliedPromocodePlan } : null}
                setAppliedPromocode={(promocodeData) => {
                  // Update promocode state when applied from MembershipUpgradeCards
                  if (promocodeData && promocodeData.isValid) {
                    setIsPromoApplied(true);
                    setPromocode(promocodeData.promocode);
                    setAppliedPromocodePlan(promocodeData.planId); // Track which plan the promocode was applied to
                  } else {
                    setIsPromoApplied(false);
                    setPromocode('');
                    setAppliedPromocodePlan(null);
                  }
                }}
                isProcessingPayment={false}
                setIsProcessingPayment={() => { }}
                processingPlanId={null}
                setProcessingPlanId={() => { }}
              />
            </Box>
          </Box>


          {/* Trust and Security Section */}
          <Box sx={{
            mt: isMobile ? 4 : 8,
            textAlign: 'center',
            bgcolor: 'Background.paper',
            p: 4,
            borderRadius: 3,
            boxShadow: 2,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography
              variant="h5"
              sx={{
                mb: isMobile ? 0 : 3,
                fontWeight: 500,
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                textAlign: 'center',
              }}
            >
              <VerifiedUser sx={{ fontSize: 40, color: '#1a4f72' }} />
              Trusted By Thousands of Users
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: isMobile ? 0 : 3,
                mt: isMobile ? 0 : 4
              }}
            >
              {/* Secure Payment */}
              <Box
                sx={{
                  flex: '1 1 300px',
                  p: 3,
                  borderRadius: 2,
                  bgcolor: '#f9f9ff',
                  minWidth: isMobile ? "100%" : 280,
                }}
              >
                <Shield sx={{ fontSize: 50, color: "#1a4f72", mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, }}>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color='#000'>
                  Your information is protected by 256-bit SSL encryption and secure payment gateways.
                </Typography>
              </Box>

              {/* Verified Profiles */}
              <Box
                sx={{
                  flex: '1 1 300px',
                  p: 3,
                  borderRadius: 2,
                  bgcolor: '#f9f9ff',
                  minWidth: isMobile ? "100%" : 280,
                }}
              >
                <VerifiedUser sx={{ fontSize: 50, color: '#1a4f72', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: '#000' }}>
                  Verified Profiles
                </Typography>
                <Typography variant="body2" color='#000'>
                  Every profile undergoes strict verification to ensure authenticity.
                </Typography>
              </Box>

              {/* Payment Options */}
              <Box
                sx={{
                  flex: '1 1 300px',
                  p: 3,
                  borderRadius: 2,
                  bgcolor: '#f9f9ff',
                  minWidth: isMobile ? "100%" : 280,
                }}
              >
                <CreditCard sx={{ fontSize: 50, color: '#1a4f72', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: '#000' }}>
                  Payment Options
                </Typography>
                <Typography variant="body2" sx={{ mb: 1.5, color: '#000' }}>
                  We accept all major payment methods:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {['Visa', 'Mastercard', 'Amex', 'UPI'].map((type, i) => (
                    <Box
                      key={i}
                      sx={{
                        px: 2,
                        py: 0.5,
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#555',
                        bgcolor: '#fff',
                      }}
                    >
                      {type}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

          </Box>
        </Box>
      </Box>
      <Footer />

      {/* Promocode Dialog */}
      <Dialog open={promocodeDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          Apply Promocode
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Enter your promocode for {selectedPlan?.name} to get ₹100 discount
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Promocode"
            fullWidth
            variant="outlined"
            value={promocode}
            onChange={(e) => setPromocode(e.target.value)}
            disabled={isChecking}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDialog}
            disabled={isChecking}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyPromocode}
            disabled={!promocode.trim() || isChecking}
            startIcon={
              isChecking ? (
                <CircularProgress size={20} />
              ) : null
            }
            sx={{
              minWidth: 120,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
              },
            }}
          >
            {isChecking ? "Checking..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MembershipPlans;