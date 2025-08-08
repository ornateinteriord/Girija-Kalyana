import React from "react"; 
import { Box, Typography, Paper } from "@mui/material";

const OthersPop = ({ userDetails }) => {
 
  const otherInfo = userDetails?.otherInfo || userDetails?.any_other_info;

  return (
    <Box sx={{ 
      p: 3,
      backgroundColor: "#f5f5f5",
      borderRadius: 2,
      boxShadow: 1
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: "500px", 
          mb: 2,
          color: "#000"
        }}
      >
        Other Information
      </Typography>
      
      <Paper elevation={0} sx={{ 
        p: 3,
        backgroundColor: "white",
        borderRadius: 2,
        minHeight: "150px"
      }}>

          <Typography 
            sx={{ 
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              color: "#000",
              textAlign: "start"
            }}
          >
            {otherInfo}
          </Typography>
       
      </Paper>
    </Box>
  );
};

export default OthersPop;