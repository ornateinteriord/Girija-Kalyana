import React from "react";
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
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { CheckCircle } from "@mui/icons-material";
import { membershipOptions } from "../../../assets/memberShipOptions/MemberShipPlans";

const MembershipDialog = ({ open, onClose, onSelectPlan }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                    onClick={() => onSelectPlan(plan)}
                  >
                    Get Started
                  </Button>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      opacity: 0.8,
                      color:'#fff'
                    }}
                  >
                    Have Promocode? Get ₹100 discount
                  </Typography>
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
    </Dialog>
  );
};

export default MembershipDialog;
