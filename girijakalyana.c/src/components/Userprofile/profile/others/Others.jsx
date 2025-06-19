import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";

const Others = () => {
  const [otherInfo, setOtherInfo] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = sessionStorage.getItem("userData");
        const { _id: userId } = JSON.parse(userData);

        const response = await axios.get(`http://localhost:5000/api/others/${userId}`);
        if (  response.data.info) {
          setOtherInfo(response.data.info);
        }
      } catch (error) {     
        console.warn("No existing record found:", error);
       
      }
    };      

    fetchData();
  }, []);


   const handleReset = () => setOtherInfo("Not Specified");

   const handleSubmit = async () => {
     try {
const userData = sessionStorage.getItem("userData");
      const { _id: userId } = JSON.parse(userData);

       const response = await axios.post("http://localhost:5000/api/others", { userId, info: otherInfo });
       
       if (response.status === 200) {
         toast.success("User info updated successfully!");
       } else {
         toast.error(`Error: ${response.data.message}`);
       }
     } catch (error) {
       console.error("Error submitting info:", error);
     }
   };

  return (
    <Box
      sx={{
        padding: "16px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Outfit, sans-serif",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#34495e",
          textAlign: "center",
        }}
      >
        Other Information
      </Typography>

      {/* Text Area */}
      <Stack spacing={2}>
        <TextField
          multiline
          minRows={5}
          maxRows={10}
          value={otherInfo}
          onChange={(e) => setOtherInfo(e.target.value)}
          placeholder="Enter other details here..."
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Stack>

      {/* Buttons */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginTop: "16px", justifyContent: "center" }}
      >
        <Button
          variant="contained"
        
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#1976d2",
              textTransform:'capitalize',
             background:'#34495e'
          }}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
         
          onClick={handleReset}
          sx={{
            borderColor: "#34495e",
            color: "black",
              textTransform:'capitalize',
               "&:hover": {
        backgroundColor:  "transparent"}
           
          }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default Others;
