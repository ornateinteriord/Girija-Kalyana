import React, { useState } from "react";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import MembershipDialog from "../../../MembershipDailog/MembershipDailog";
import {membershipOptions} from '../../../MembershipDailog/MemberShipPlans'


const PremiumButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="contained"
    size="small"
    sx={{
      textTransform: "none",
      background: "linear-gradient(45deg, #FFD700 0%, #D4AF37 100%)",
      color: "#000",
      fontWeight: "bold",
      "&:hover": {
        background: "linear-gradient(45deg, #D4AF37 0%, #FFD700 100%)",
      },
    }}
  >
    Upgrade
  </Button>
);

const AboutPop = ({ userDetails }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleUpgrade = () => {
    setSelectedPlan(membershipOptions[1]); 
    setDialogOpen(true);
  };
  

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmPayment = () => {
    setDialogOpen(false);
  };

  if (!userDetails || Object.keys(userDetails).length === 0) {
    return <Typography>No user details available.</Typography>;
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: "500px" }}>
          User Information
        </Typography>
        <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px", width: "150px" }}>
                  Full Name
                </TableCell>
                <TableCell>{`${userDetails?.first_name || "N/A"} ${
                  userDetails?.last_name || ""
                }`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Date of Birth</TableCell>
                <TableCell>{userDetails?.date_of_birth || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>
                  Marital Status
                </TableCell>
                <TableCell>{userDetails?.marital_status || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Language</TableCell>
                <TableCell>{userDetails?.mother_tounge || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Address</TableCell>
                <TableCell>{userDetails?.address || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Contact No</TableCell>
                <TableCell>
                  {userDetails?.mobile_no || <PremiumButton onClick={handleUpgrade} />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Email</TableCell>
                <TableCell>
                  {userDetails?.email_id || <PremiumButton onClick={handleUpgrade} />}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <MembershipDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        selectedPlan={selectedPlan}
        onConfirm={handleConfirmPayment}
      />
    </Box>
  );
};

export default AboutPop;