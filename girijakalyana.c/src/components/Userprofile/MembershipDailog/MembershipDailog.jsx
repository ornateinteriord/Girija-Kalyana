import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { CheckCircle } from "@mui/icons-material";
import { load } from "@cashfreepayments/cashfree-js";
import { toast } from "react-toastify";
import { membershipOptions, PROMOCODE_DISCOUNT } from "../../../assets/memberShipOptions/MemberShipPlans";
import { useCreatePaymentOrder } from "../../api/Payment";
import PromocodeDialog from "./PromocodeDialog";
import TokenService from "../../token/tokenService";

const MembershipDialog = ({ open, onClose, onSelectPlan }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPlanForPromocode, setSelectedPlanForPromocode] = useState(null);
  const [promocodeOpen, setPromocodeOpen] = useState(false);
  const [appliedPromocode, setAppliedPromocode] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState(null);
  
  const createOrderMutation = useCreatePaymentOrder();
  
  // Reset processing state when dialog is closed
  useEffect(() => {
    if (!open) {
      setIsProcessingPayment(false);
      setProcessingPlanId(null);
    }
  }, [open]);
  
  const handlePromocodeApply = (promocodeData) => {
    setAppliedPromocode({
      ...promocodeData,
      planId: selectedPlanForPromocode?.name // Store which plan this promocode is for
    });
    setPromocodeOpen(false);
  };
  
  const handlePromocodeClick = useCallback((plan) => {
    console.log('Promocode click for plan:', plan.name);
    setSelectedPlanForPromocode(plan);
    setPromocodeOpen(true);
  }, []);
  
  const calculateFinalAmount = (plan) => {
    // Use numeric value directly from centralized config
    const baseAmount = plan.discountedPriceNum;
    // Only apply discount if promocode is for this specific plan
    if (appliedPromocode && appliedPromocode.isValid && appliedPromocode.planId === plan.name) {
      return Math.max(baseAmount - PROMOCODE_DISCOUNT, 0);
    }
    return baseAmount;
  };
  
  const isPromocodeAppliedForPlan = (plan) => {
    return appliedPromocode && appliedPromocode.isValid && appliedPromocode.planId === plan.name;
  };
  
  const handleGetStarted = useCallback(async (plan) => {
    // Prevent multiple simultaneous payment processes
    if (isProcessingPayment || processingPlanId) {
      console.log('Payment already in progress, ignoring click');
      return;
    }
    
    console.log('Starting payment for plan:', plan.name);
    
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
    
    setIsProcessingPayment(true);
    setProcessingPlanId(plan.name);
    
    try {
      const userProfile = TokenService.getUser();
      
      // Validate user profile data
      if (!userProfile) {
        throw new Error('User not authenticated. Please login again.');
      }
      
      if (!userProfile.mobile_no || !userProfile.email_id || !userProfile.first_name) {
        throw new Error('Incomplete user profile. Please complete your profile first.');
      }
      
      const orderId = "order_" + Date.now();
      // Use numeric values directly from centralized config
      const originalAmount = plan.discountedPriceNum;
      const finalAmount = calculateFinalAmount(plan);
      const planType = plan.planType || (plan.name.includes('PREMIUM') ? 'premium' : 'silver');
      
      console.log('Payment request data:', {
        orderId,
        orderAmount: finalAmount,
        customerName: userProfile.first_name,
        customerEmail: userProfile.email_id,
        customerPhone: userProfile.mobile_no,
        planType,
        promocode: appliedPromocode?.promocode || null,
        originalAmount,
      });
      
      // Create payment order
      const orderResponse = await createOrderMutation.mutateAsync({
        orderId,
        orderAmount: finalAmount,
        customerName: userProfile.first_name,
        customerEmail: userProfile.email_id,
        customerPhone: userProfile.mobile_no,
        planType,
        promocode: appliedPromocode?.promocode || null,
        originalAmount,
      });
      
      if (orderResponse?.payment_session_id) {
        // Store the order ID and timestamp in localStorage for later verification
        localStorage.setItem('pendingOrderId', orderId);
        localStorage.setItem(`orderTimestamp_${orderId}`, Date.now().toString());
        console.log('Stored pending order ID with timestamp:', orderId);

        // Use cashfree_env from backend to ensure environment consistency
        const cashfreeEnv = orderResponse.cashfree_env || "sandbox";
        console.log('🔄 Using Cashfree environment from backend:', cashfreeEnv);

        // Initialize Cashfree payment with environment from backend
        const cashfree = await load({ mode: cashfreeEnv });

        // Start payment process
        cashfree.checkout({
          paymentSessionId: orderResponse.payment_session_id,
          redirectTarget: "_self", // Will redirect to return URL after completion
        });

        // Don't close dialog immediately - let Cashfree handle the redirect
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      // Note: We don't reset the processing state here because the user will be redirected
      // The state will be reset when the component remounts
      // setIsProcessingPayment(false);
      // setProcessingPlanId(null);
    }
  }, [isProcessingPayment, processingPlanId, onSelectPlan, createOrderMutation, appliedPromocode, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          fontSize: isMobile ? "1.25rem" : "1.5rem",
          fontWeight: 700,
          textAlign: "center",
          p: isMobile ? 2 : 3,
        }}
      >
        Membership Plans
        <IconButton
          sx={{
            position: "absolute",
            right: isMobile ? 8 : 15,
            top: isMobile ? 8 : 15,
          }}
          onClick={onClose}
        >
          <AiOutlineClose size={isMobile ? 20 : 24} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: isMobile ? 2 : 1.5 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            textAlign: isMobile ? "center" : "left",
            mb: 1,
            fontWeight: 600,
            color: theme.palette.text.secondary,
            textTransform: "capitalize",
          }}
        >
          Choose the best plan for you
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          {membershipOptions.map((plan, index) => (
            <Box
              key={index}
              sx={{
                flex: "1 1 calc(50% - 16px)",
                minWidth: isMobile ? "100%" : "auto",
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 4,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 8,
                  },
                  background: plan.gradient,
                  color: "white",
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: isMobile ? 55 : 16,
                      right: 16,
                      bgcolor: "rgba(255,255,255,0.2)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                   
                    }}
                  >
                    {plan.discount}
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {plan.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
                    {isPromocodeAppliedForPlan(plan) ? (
                      <>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 800, 
                            mr: 2,
                            color: '#4CAF50' // Green color for discounted price
                          }}
                        >
                          ₹{calculateFinalAmount(plan)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "line-through",
                            opacity: 0.8,
                            color: '#fff',
                            mr: 1
                          }}
                        >
                          {plan.discountedPrice}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "line-through",
                            opacity: 0.6,
                            color: '#fff'
                          }}
                        >
                          {plan.originalPrice}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="h4" sx={{ fontWeight: 800, mr: 2 }}>
                          {plan.discountedPrice}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "line-through",
                            opacity: 0.8,
                            color:'#fff'
                          }}
                        >
                          {plan.originalPrice}
                        </Typography>
                      </>
                    )}
                  </Box>

                  <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.3)", height:'1px' }} />

                  <List dense>
                    {plan.features.map((feature, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                        <CheckCircle sx={{ fontSize: 18, mr: 1.5 }} />
                     <Typography variant="body2" sx={{color:'#fff'}}>{feature}</Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Validity: {plan.duration}
                  </Typography>

                  {isPromocodeAppliedForPlan(plan) && (
                    <Box sx={{ 
                      mt: 1, 
                      p: 2, 
                      backgroundColor: "rgba(76, 175, 80, 0.15)", 
                      borderRadius: 2,
                      border: "1px solid rgba(76, 175, 80, 0.4)",
                      mb: 2
                    }}>
                      <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600, mb: 1 }}>
                        ✅ Promocode "{appliedPromocode.promocode}" Applied Successfully!
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 500 }}>
                        You saved ₹{appliedPromocode.discount}
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      bgcolor: "white",
                      color: plan.color,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.9)",
                      },
                      py: 1.5,
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: 2,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Get Started clicked for:', plan.name);
                      handleGetStarted(plan);
                    }}
                    disabled={isProcessingPayment}
                    startIcon={processingPlanId === plan.name ? <CircularProgress size={20} /> : null}
                  >
                    {processingPlanId === plan.name ? "Processing..." : "Get Started"}
                  </Button>

                  <Button
                    variant="text"
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      opacity: 0.8,
                      color: '#fff',
                      textDecoration: 'underline',
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        textDecoration: 'underline',
                      }
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Promocode clicked for:', plan.name);
                      handlePromocodeClick(plan);
                    }}
                    disabled={isProcessingPayment}
                  >
                    {isPromocodeAppliedForPlan(plan) 
                      ? "Promocode Applied ✓" 
                      : "Have Promocode? Get ₹100 discount"
                    }
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
  <Button
    variant="outlined"
    onClick={onClose}
    sx={{
      color: "#333",
      borderColor: "#ccc",
      fontWeight: "bold",
      textTransform: "capitalize",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.08)", 
        borderColor: "#bbb",
      },
    }}
  >
    Cancel
  </Button>
      </DialogActions>
      
      <PromocodeDialog
        open={promocodeOpen}
        onClose={() => setPromocodeOpen(false)}
        onPromocodeApply={handlePromocodeApply}
      />
    </Dialog>
  );
};

export default MembershipDialog;
