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

const EducationPop = ({ userDetails }) => {
  if (!userDetails || Object.keys(userDetails).length === 0) {
    return <Typography>No user details available.</Typography>;
  }

  const data = [
    {
      label: "Highest Qualification",
      value: userDetails.educational_qualification || "N/A",
    },
    {
      label: "Occupation",
      value: userDetails.occupation || "N/A",
    },
    {
      label: "Monthly Income",
      value: userDetails.income_per_month || "N/A",
    },
    {
      label: "Work Location",
      value: userDetails.occupation_country || "N/A",
    },
    {
      label: "Preferred Work Country",
      value: userDetails.occupation_country_preference || "N/A",
    },
    {
      label: "Preferred Marital Status",
      value: userDetails.maritalstatus_preference || "N/A",
    },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: "500px" }}>
          Education & Occupation Information
        </Typography>
        <TableContainer sx={{ boxShadow: 3 }} component={Paper}>
          <Table>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      fontWeight: "500px",
                      backgroundColor: "#f9f9f9",
                      width: "40%",
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

export default EducationPop;
