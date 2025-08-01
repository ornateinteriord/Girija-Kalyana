import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  useGetMemberDetails,
  useUpdateProfile
} from "../../../api/User/useGetProfileDetails";
import TokenService from "../../../token/tokenService";
import toast from "react-hot-toast";
import rawJsonData from "../eduction/jsondata/data.json";
import { LoadingComponent } from "../../../../App";
import CustomAutocomplete from "../../../Autocomplete/CustomAutocomplete";

const jsonData = rawJsonData.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const Education = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const registerNo = TokenService.getRegistrationNo();

  const [formData, setFormData] = useState({
    educational_qualification: "",
    occupation: "",
    income_per_month: "",
    occupation_country: ""
  });

  // Initialize suggestions state
  const [educationSuggestions, setEducationSuggestions] = useState(jsonData.qualificationValues || []);
  const [occupationSuggestions, setOccupationSuggestions] = useState(jsonData.occupationValues || []);
  const [incomeSuggestions, setIncomeSuggestions] = useState(jsonData.incomeValues || []);
  const [countrySuggestions, setCountrySuggestions] = useState(jsonData.countries || []);

  const {
    data: userProfile,
    isLoading,
    isError,
    error
  } = useGetMemberDetails(registerNo);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (userProfile) {
      setFormData({ ...userProfile });
    }
  }, [userProfile]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateProfile(formData, {
      onSuccess: () => toast.success("Profile updated successfully!"),
      onError: () => toast.error("Failed to update profile.")
    });
  };

  const handleClear = () => {
    if (userProfile) {
      setFormData({
        ...userProfile,
      });
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "8px",
        width: { xs: "100%", sm: "90%", md: "85%", lg: "100%" },
        p: { xs: 1, sm: 4 },
        boxSizing: 'border-box'
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5" gutterBottom sx={{ color: "#34495e", fontWeight: '500px' }}>
          Education & Occupation
        </Typography>
        <form>
          <Stack spacing={3}>
            <Stack
              direction= {isMobile ? "column" : "row"}
              spacing={3}
              alignItems={isMobile ? "center" : "flex-start"}
            >
              {/* Column 1 */}
              <Box sx={{ width: '100%' }}>
                <CustomAutocomplete
                  options={educationSuggestions}
                  FullWidth
                  label="Qualification"
                  name="educational_qualification"
                  value={formData.educational_qualification}
                  onChange={(e) => handleChange("educational_qualification", e.target.value)}
                  sx={{ 
                    mb:isMobile ? 2 : 4 }}
                />

                <CustomAutocomplete
                  options={occupationSuggestions}
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleChange("occupation", e.target.value)}
                 FullWidth
                    sx={{ 
                    mb:isMobile ? 0 : 3}}
                />
              </Box>

              {/* Column 2 */}
              <Box sx={{ width: '100%' }}>
                <CustomAutocomplete
                  options={incomeSuggestions}
                  label="Income Per Month"
                  name="income_per_month"
                  FullWidth
                  value={formData.income_per_month}
                  onChange={(e) => handleChange("income_per_month", e.target.value)}
                 sx={{ 
                    mb:isMobile ? 2 : 4 }}
                />

                <CustomAutocomplete
                  options={countrySuggestions}
                  label="Occupation Country"
                  name="occupation_country"
                  value={formData.occupation_country}
                  onChange={(e) => handleChange("occupation_country", e.target.value)}
                  FullWidth
                  mb={3}
                />
              </Box>
            </Stack>

            {/* Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                flexDirection:"row" ,
                alignItems: "center",
                justifyContent: "end",
                width: '100%'
              }}
            >
              <Button
                onClick={handleClear}
                variant="outlined"
                sx={{
                  color: "black",
                  backgroundColor: "#fff",
                  textTransform: "capitalize",
                  "&:hover": { backgroundColor: "#fff" },
                  width: isMobile ? '100%' : '130px'
                }}
              >
                Reset
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={isUpdating}
                sx={{
                  backgroundColor: "#34495e",
                  textTransform: "capitalize",
                  "&:hover": { backgroundColor: "#2c3e50" },
                  width: isMobile ? '100%' : '130px'
                }}
              >
                {isUpdating ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Stack>
      {isLoading && <LoadingComponent />}
    </Box>
  );
};

export default Education;