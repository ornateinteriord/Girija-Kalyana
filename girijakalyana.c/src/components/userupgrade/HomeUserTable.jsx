import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import MembershipUpgradeCards from "../common/MembershipUpgradeCards";

const HomeUserTable = () => {
  const [open, setOpen] = useState(false);
  const [currentMembership, ] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleUpgrade = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Container
        sx={{
          mb: 0,
          mt: 0,
          px: isSmallScreen ? 1 : 3,
          maxWidth: isSmallScreen ? "100%" : "lg",
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            mt={1}
            sx={{ fontSize: isSmallScreen ? "0.9rem" : "1rem" }}
          >
            Choose your plan and enjoy <strong>exclusive benefits</strong> tailored for you!
          </Typography>
        </Box>

        {currentMembership && (
          <Box
            sx={{
              border: "1px solid black",
              padding: isSmallScreen ? "8px" : "10px",
              borderRadius: "10px",
              background: "black",
              mb: 3,
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-around",
              gap: isSmallScreen ? 1 : 0,
            }}
          >
            <Typography
              variant={isSmallScreen ? "subtitle1" : "h6"}
              sx={{ fontWeight: "bold", color: "#fff", textAlign: isSmallScreen ? "center" : "left" }}
            >
              Current Plan: <span style={{ color: "#fff" }}>{currentMembership.type}</span>
            </Typography>
            <Typography
              variant={isSmallScreen ? "subtitle1" : "h6"}
              sx={{ color: "#fff", fontWeight: "bold", textAlign: isSmallScreen ? "center" : "left" }}
            >
              Price: {currentMembership.price}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                fontSize: isSmallScreen ? "14px" : "16px",
                fontWeight: "bold",
                background: "red",
                color: "#fff",
                textTransform: "capitalize",
                border: "none",
                width: isSmallScreen ? "100%" : "auto",
                mt: isSmallScreen ? 1 : 0,
              }}
            >
              Remove Membership
            </Button>
          </Box>
        )}

        <Grid container justifyContent="center">
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              maxWidth: isSmallScreen ? "100%" : "400px",
            }}
          >
            <Card
              sx={{
                p: 0,
                textAlign: "center",
                boxShadow: 6,
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
                background: "linear-gradient(135deg,rgb(235, 247, 101) 0%,rgb(136, 126, 8) 100%)",
                color: "#fff",
                width:isSmallScreen? "300px": "500px",
                marginBottom: "15px",
              }}
            >
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography
                  variant={isSmallScreen ? "h6" : "h5"}
                  fontWeight={700}
                  sx={{ fontSize: isSmallScreen ? "1.25rem" : "1.5rem",color:'#000' }}
                >
                  Upgrade Your Membership
                </Typography>
                <Typography
                  variant={isSmallScreen ? "subtitle1" : "h6"}
                  sx={{ mt: 1, opacity: 0.9 ,color:'#000'}}
                >
                  Unlock premium features
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#fff",
                    color: "#333",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    textTransform: "capitalize",
                    fontSize: isSmallScreen ? "0.875rem" : "1rem",
                    padding: isSmallScreen ? "6px 16px" : "8px 22px",
                    "&:hover": { backgroundColor: "#eee" },
                  }}
                  onClick={handleUpgrade}
                >
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isSmallScreen}
      >
        <DialogTitle
          sx={{
            fontSize: isSmallScreen ? "1.25rem" : "1.5rem",
            fontWeight: 700,
            textAlign: "center",
            p: isSmallScreen ? 2 : 3,
          }}
        >
          Membership Plans
          <IconButton
            sx={{
              position: "absolute",
              right: isSmallScreen ? 8 : 15,
              top: isSmallScreen ? 8 : 15,
            }}
            onClick={handleClose}
          >
            <AiOutlineClose size={isSmallScreen ? 20 : 24} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: isSmallScreen ? 2 : 3 }}>
          <MembershipUpgradeCards
            onPlanSelect={(plan) => {
              // Handle plan selection
              console.log("Selected plan:", plan);
              // Add your logic here for handling plan selection
            }}
            isProcessingPayment={false}
            setIsProcessingPayment={() => {}}
            processingPlanId={null}
            setProcessingPlanId={() => {}}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", p: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
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
    </Box>
  );
};

export default HomeUserTable;