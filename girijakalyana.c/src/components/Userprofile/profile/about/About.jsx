import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";

import TokenService from "../../../token/tokenService";
import { useGetMemberDetails, useUpdateProfile } from "../../../api/User/useGetProfileDetails";
import { LoadingComponent } from "../../../../App";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { calculateAge } from "../../../../utils/common";

const About = () => {
  const registerNo = TokenService.getRegistrationNo();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    pincode: '',
    address: '',
    occupation_country: '',
    mother_tounge: '',
    state: '',
    mobile_no: '',
    email_id: '',
    age: ''
  });

  const { data: userProfile, isLoading, isError, error } = useGetMemberDetails(registerNo);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [isError, error]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        ...userProfile,
        date_of_birth: userProfile.date_of_birth?.split('T')[0] || ""
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (userProfile) {
      setFormData({
        ...userProfile,
        date_of_birth: userProfile.date_of_birth?.split('T')[0] || ""
      });
    }
  };

  const handleSave = () => {
    updateProfile(formData);
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        p: { xs: 0, sm: 2, md: 2 },
        maxWidth: '100%',
        mx: 'auto',
        width: '100%',
      }}
    >

     <Typography variant="h5" sx={{ fontSize: { xs: '21px', sm: '25px' }, color: '#34495e',
           mt:{xs:1},mb:{xs:1,md:2} }} fontWeight="500px">
            Profile Information
             </Typography>

      {/* Form Sections */}
      <Box display="flex" flexDirection="column" gap={4}>
        {/* Personal + Contact */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
          gap={3}
        >
          {/* Personal Details */}
          <Box>
            <Typography variant="h6" fontWeight={500} mb={2}>
              Personal Details
            </Typography>
            <Stack spacing={2}>
              <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} disabled={isUpdating} fullWidth />
              <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} disabled={isUpdating} fullWidth />
             <LocalizationProvider dateAdapter={AdapterDayjs}>
                             <DatePicker
                               label="Date of Birth"
                               value={
                                 formData.date_of_birth
                                   ? dayjs(formData.date_of_birth)
                                   : null
                               }
                               onChange={(newValue) => {
                                 const dob = newValue
                                   ? newValue.toISOString().split("T")[0]
                                   : "";
                                 const age = dob ? calculateAge(dob) : "";
                                 setFormData((prev) => ({
                                   ...prev,
                                   date_of_birth: dob,
                                   age: age.toString(),
                                 }));
                               }}
                               maxDate={dayjs()}
                               slotProps={{
                                 textField: {
                                   fullWidth: true,
                                   required: true,
                                   sx: { mb: 3 },
                                 },
                               }}
                             />
                           </LocalizationProvider>
              <TextField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} disabled={isUpdating} fullWidth />
            </Stack>
          </Box>

          {/* Contact Details */}
          <Box>
            <Typography variant="h6" fontWeight={500} mb={2}>
              Contact Details
            </Typography>
            <Stack spacing={2}>
              <TextField label="Mobile Number" name="mobile_no" value={formData.mobile_no} onChange={handleChange} disabled={isUpdating} fullWidth />
              <TextField label="Email" name="email_id" type="email" value={formData.email_id} onChange={handleChange} disabled={isUpdating} fullWidth />
              <TextField label="Address" name="address" multiline rows={3} value={formData.address} onChange={handleChange} disabled={isUpdating} fullWidth />
            </Stack>
          </Box>
        </Box>

        {/* Location + Additional */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
          gap={3}
        >
          {/* Location Details */}
          <Box>
            <Typography variant="h6" fontWeight={500} mb={2}>
              Location Details
            </Typography>
            <Stack spacing={2}>
              <TextField label="State" name="state" value={formData.state} onChange={handleChange} disabled={isUpdating} fullWidth />
              <TextField label="Pin Code" name="pincode" value={formData.pincode} onChange={handleChange} disabled={isUpdating} fullWidth />
              <TextField label="Occupation Country" name="occupation_country" value={formData.occupation_country} onChange={handleChange} disabled={isUpdating} fullWidth />
            </Stack>
          </Box>

          {/* Additional Details */}
          <Box>
            <Typography variant="h6" fontWeight={500} mb={2}>
              Additional Details
            </Typography>
            <Stack spacing={2}>
              <TextField label="Mother Tongue" name="mother_tounge" value={formData.mother_tounge} onChange={handleChange} disabled={isUpdating} fullWidth />
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Buttons */}
      <Box
        display="flex"
        justifyContent={{ xs: 'space-evenly', sm: 'flex-end' }}
        gap={2}
        mt={2}
      >
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={isUpdating}
          fullWidth={true}
          sx={{ 
            color: "black",
            maxWidth: { xs: '160px', sm: 180 },
            textTransform: 'capitalize',
            "&:hover": {
              backgroundColor: "transparent"
            }
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isUpdating}
          fullWidth={true}
          sx={{ 
            maxWidth: { xs: '160px', sm: 200 },
            textTransform: 'capitalize', 
            backgroundColor: "#34495e",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#4b6074"
            } 
          }}
          startIcon={isUpdating ? <CircularProgress size={20} /> : null}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      {isLoading && <LoadingComponent />}
    </Box>
  );
};

export default About;