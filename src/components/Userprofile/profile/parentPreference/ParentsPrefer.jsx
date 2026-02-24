import React, { memo, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@mui/material";
import rawJsonData from "../eduction/jsondata/data.json";
import toast from "react-hot-toast";
import { useGetMemberDetails, useUpdateProfile } from "../../../api/User";
import TokenService from "../../../token/tokenService";
import { LoadingComponent } from "../../../../App";
import CustomAutocomplete from "../../../Autocomplete/CustomAutocomplete";

const datas = rawJsonData.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const ParentsPrefer = () => {
  const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const registerNo = TokenService.getRegistrationNo();

  const [formData, setFormData] = useState({
    caste_preference: "",
    from_age_preference: "",
    to_age_preference: "",
    from_height_preference: "",
    to_height_preference: "",
    occupation_country_preference: "",
    maritalstatus_preference: "",
    education_preference: ""
  });

  const { data: userProfile, isLoading, isError, error } = useGetMemberDetails(registerNo);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        ...userProfile
      });
    }
  }, [userProfile]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateProfile(formData, {});
  };

  const handleClear = () => {
     if (userProfile) {
      setFormData({
        ...userProfile,
      });
    }
  };

  const formFields = [
    {
      name: "caste_preference",
      label: "Caste Preference",
      options: [...datas?.casteValues, 'Any Brahmin'],
      currentValue: formData.caste_preference
    },
    {
      name: "occupation_country_preference",
      label: "Occupation Country",
      options: ["India", "USA", "China"],
      currentValue: formData.occupation_country_preference
    },
    {
      name: "from_age_preference",
      label: "Age Preference (From)",
      options: datas?.minAge,
      currentValue: formData.from_age_preference
    },
    {
      name: "to_age_preference",
      label: "Age Preference (To)",
      options: datas?.minAge,
      currentValue: formData.to_age_preference
    },
    {
      name: "from_height_preference",
      label: "Height Preference (From)",
      options: [...datas?.heightValues,'Any Height'],
      currentValue: formData.from_height_preference
    },
    {
      name: "to_height_preference",
      label: "Height Preference (To)",
      options: [...datas?.heightValues,'Any Height'],
      currentValue: formData.to_height_preference
    },
    {
      name: "maritalstatus_preference",
      label: "Marital Status",
      options: datas?.marritalStatus,
      currentValue: formData.maritalstatus_preference
    },
    {
      name: "education_preference",
      label: "Education Preference",
      options: [...datas?.qualificationValues, 'Any Education'],
      currentValue: formData.education_preference
    }
  ];

  return (
    <Box
      sx={{
        padding: isMobile ? 0 : 3,
        width: { xs: "100%", md: "100%" },
        maxWidth: "100%"
      }}
    >

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)'
          },
          gap: 3.5,
          mt:2
        }}
      >
        {formFields.map((field, index) => (
          <CustomAutocomplete
            key={index}
            options={field.options || []}
            label={field.label}
            name={field.name}
            value={field.currentValue}
            onChange={(e) => handleChange(field.name, e.target.value)}
            sx={{ width: '100%' }}
          />
        ))}
      </Box>

      <Box
        mt={1.5}
        sx={{
          display: "flex",
          gap: "10px",
          flexDirection: { xs: "row", sm: "row" },
          alignItems: { xs: "center", sm: "center" },
          justifySelf: { sm: 'end', md: 'end' }
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
            width: { xs: "100%", sm: "130px" }
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
            width: { xs: "100%", sm: "130px" }
          }}
        >
          {isUpdating ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </Box>
      {isLoading && <LoadingComponent />}
    </Box>
  );
};

export default memo(ParentsPrefer);