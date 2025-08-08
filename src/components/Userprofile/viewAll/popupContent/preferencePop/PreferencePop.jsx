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

const PreferencePop = ({ userDetails }) => {
  if (!userDetails || Object.keys(userDetails).length === 0) {
    return <Typography>No user details available.</Typography>;
  }

  const data = [
    { label: "Marital Status", value: userDetails.maritalstatus_preference || "N/A" },
    { label: "Age Preference", value: userDetails.to_age_preference || "N/A" },
    { label: "Height Preference", value: userDetails.from_height_preference || "N/A" },
    { label: "Education Preference", value: userDetails.education_preference || "N/A" },
    { label: "Caste Preference", value: userDetails.caste_preference || "N/A" },
    { label: "Occupation Country", value: userDetails.occupation_country_preference || "N/A" },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: "500px" }}>
          Partner Preferences
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

export default PreferencePop;
