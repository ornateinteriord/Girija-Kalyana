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
  Typography,
} from "@mui/material";

const LifeStylePop = ({ userDetails }) => {
  if (!userDetails || Object.keys(userDetails).length === 0) {
    return <Typography>No user details available.</Typography>;
  }

 
  const data = [
    { label: "Skin Type", value: userDetails.skin_type },
    { label: "Body Type", value: userDetails.body_type },
    { label: "Diet", value: userDetails.diet },
    { label: "Drink", value:userDetails.drink },
    { label: "Smoke", value: userDetails.smoke},
    { label: "Sunsign", value: userDetails.sunsign },
    { label: "Blood Group", value: userDetails.bloodgroup },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: "500px" }}>
          Lifestyle Details
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      fontWeight: "500px",
                      width: "40%",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {row.label}
                  </TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};

export default LifeStylePop;
