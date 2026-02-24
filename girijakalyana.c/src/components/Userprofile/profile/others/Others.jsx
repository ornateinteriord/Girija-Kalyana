import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Stack
} from "@mui/material";
import { useGetMemberDetails, useUpdateProfile } from "../../../api/User";
import TokenService from "../../../token/tokenService";
import { LoadingComponent } from "../../../../App";
import { toast } from "react-toastify";

const Others = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const registerNo = TokenService.getRegistrationNo();
  
  const [formData, setFormData] = useState({
    otherInfo: ""
  });

  const { 
    data: userProfile, 
    isLoading, 
    isError,
    error 
  } = useGetMemberDetails(registerNo);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (userProfile) {
      setFormData({
        otherInfo: userProfile.otherInfo || ""
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    updateProfile(formData,);
  };

  const handleReset = () => {
    if (userProfile) {
      setFormData({
        ...userProfile,
        // otherInfo:"Not Specified"
      });
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  return (
    <Box sx={{ 
      fontFamily: "Outfit, sans-serif", 
      padding: isMobile ? 0 : 3,
      width: "100%",
      maxWidth: {xs:'100%',md:'50%'},
      margin: "0 auto",
       borderRadius: 2,
       mb: 3,
    }}>


      <Box sx={{ mb: 3,mt:2 }}>
        <TextField
          multiline
          minRows={5}
          maxRows={10}
          name="otherInfo"
          value={formData.otherInfo}
          onChange={handleChange}
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
      </Box>
     
      <Box
        mt={4}
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: "row",
          justifyContent: "end"
        }}
      >
        <Button
          onClick={handleReset}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            color: "black",
            backgroundColor: "#fff",
            textTransform: "capitalize",
            "&:hover": { backgroundColor: "#fff" },
            width: isMobile ? "100%" : "130px"
          }}
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isUpdating}
          fullWidth={isMobile}
          sx={{
            backgroundColor: "#34495e",
            textTransform: "capitalize",
            "&:hover": { backgroundColor: "#2c3e50" },
            width: isMobile ? "100%" : "130px"
          }}
        >
          {isUpdating ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </Box>
      
      {isLoading && <LoadingComponent/>}
    </Box>
  );
};

export default Others;