import React, { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";
import { membershipOptions } from "../../assets/memberShipOptions/MemberShipPlans";
import PromocodeDialog from "../Userprofile/MembershipDailog/PromocodeDialog";

const MembershipUpgradeCards = ({ 
  onPlanSelect, 
  onPromocodeApply,
  appliedPromocode,
  setAppliedPromocode,
  isProcessingPayment,
  setIsProcessingPayment,
  processingPlanId,
  setProcessingPlanId
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPlanForPromocode, setSelectedPlanForPromocode] = useState(null);
  const [promocodeOpen, setPromocodeOpen] = useState(false);

  const handlePromocodeApply = (promocodeData) => {
    if (setAppliedPromocode) {
      setAppliedPromocode({
        ...promocodeData,
        planId: selectedPlanForPromocode?.name
      });
    }
    if (onPromocodeApply) {
      onPromocodeApply(promocodeData);
    }
    setPromocodeOpen(false);
  };

  const handlePromocodeClick = useCallback((plan) => {
    setSelectedPlanForPromocode(plan);
    setPromocodeOpen(true);
  }, []);

  const calculateFinalAmount = (plan) => {
    const baseAmount = parseInt(plan.discountedPrice.replace('₹', '').replace(',', '').replace('.', ''));
    if (appliedPromocode && appliedPromocode.isValid && appliedPromocode.planId === plan.name) {
      return Math.max(baseAmount - appliedPromocode.discount, 0);
    }
    return baseAmount;
  };

  const isPromocodeAppliedForPlan = (plan) => {
    return appliedPromocode && appliedPromocode.isValid && appliedPromocode.planId === plan.name;
  };

  const handleGetStarted = useCallback(async (plan) => {
    if (isProcessingPayment || processingPlanId) {
      return;
    }

    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  }, [isProcessingPayment, processingPlanId, onPlanSelect]);

  return (
    <>
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
                          color: '#4CAF50'
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

      <PromocodeDialog
        open={promocodeOpen}
        onClose={() => setPromocodeOpen(false)}
        onPromocodeApply={handlePromocodeApply}
      />
    </>
  );
};

export default MembershipUpgradeCards;