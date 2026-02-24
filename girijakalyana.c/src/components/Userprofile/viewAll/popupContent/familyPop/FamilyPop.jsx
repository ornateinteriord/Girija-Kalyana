import React from "react";
import { 
  Box, 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Paper, 
  Typography 
} from "@mui/material";

const FamilyPop = ({ userDetails }) => {
  if (!userDetails || typeof userDetails !== "object" || Object.keys(userDetails).length === 0) {
    return <Typography>No family details available</Typography>;
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: "500px" }}>
          Family Information
        </Typography>
        <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Father's Name</TableCell>
                <TableCell>{userDetails?.name_of_parent?.includes("Father") ? 
                  userDetails.name_of_parent.split("-")[1]?.trim() || "N/A" : 
                  "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Brothers</TableCell>
                <TableCell>
                  {`${userDetails.brother_elder_married || 0 + userDetails.brother_elder_unmarried || 0} elder, `}
                  {`${userDetails.brother_younger_married || 0 + userDetails.brother_younger_unmarried || 0} younger` || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Sisters</TableCell>
                <TableCell>
                  {`${userDetails.sister_elder_married || 0 + userDetails.sister_elder_unmarried || 0} elder, `}
                  {`${userDetails.sister_younger_married || 0 + userDetails.sister_younger_unmarried || 0} younger` || "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Caste</TableCell>
                <TableCell>{userDetails?.caste || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Subcaste</TableCell>
                <TableCell>{userDetails?.subcaste || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Gotra</TableCell>
                <TableCell>{userDetails?.gotra || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "500px" }}>Rashi</TableCell>
                <TableCell>{userDetails?.rashi || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};

export default FamilyPop;