import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import toast from "react-hot-toast";
import { useGetMemberDetails, useUpdateProfile } from "../../../api/User/useGetProfileDetails";
import TokenService from "../../../token/tokenService";
import { LoadingComponent } from "../../../../App";

const FamilyReligious = () => {
  const registerNo = TokenService.getRegistrationNo();
  const [formData, setFormData] = useState({
    religion: '',
    caste: '',
    subcaste: '',
    gotra: '',
    rashi: '',
    nakshatra: '',
    sunsign: '',
    name_of_parent: '',
    brother_younger_unmarried: '',
    brother_younger_married: '',
    brother_elder_unmarried: '',
    brother_elder_married: '',
    sister_younger_unmarried: '',
    sister_younger_married: '',
    sister_elder_unmarried: '',
    sister_elder_married: ''
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
        ...userProfile,
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(formData, {
      onSuccess: () => {
        toast.success("Details updated successfully");
      },
      onError: () => {
        toast.error("Failed to update details");
      }
    });
  };

  const handleReset = () => {
    if (userProfile) {
      setFormData({
        ...userProfile,
      });
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        p: { xs: 1, sm: 3, md: 2 },
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: 1200,
        mx: 'auto'
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontSize: { xs: '21px', sm: '25px' }, color: '#34495e' }} fontWeight="bold">
          Family & Religious Information
        </Typography>
      </Box>

      {/* Sections */}
      <Stack spacing={4}>
        {/* Religious Section */}
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Religious Details
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={2}>
            {[
              { name: 'religion', label: 'Religion' },
              { name: 'caste', label: 'Caste' },
              { name: 'subcaste', label: 'Subcaste' },
              { name: 'gotra', label: 'Gotra' },
              { name: 'rashi', label: 'Rashi' },
              { name: 'nakshatra', label: 'Nakshatra' },
            ].map(({ name, label }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={isUpdating}
                fullWidth
              />
            ))}
          </Box>
        </Box>

        {/* Family Section */}
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Family Details
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            <TextField
              label="Name of Parent"
              name="name_of_parent"
              value={formData.name_of_parent}
              onChange={handleChange}
              disabled={isUpdating}
              fullWidth
            />
            {[
              'brother_younger_unmarried',
              'brother_younger_married',
              'brother_elder_unmarried',
              'brother_elder_married',
              'sister_younger_unmarried',
              'sister_younger_married',
              'sister_elder_unmarried',
              'sister_elder_married',
            ].map((field) => (
              <TextField
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={isUpdating}
                fullWidth
              />
            ))}
          </Box>
        </Box>
      </Stack>

      {/* Actions */}
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
            color:"black",
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

      {isLoading && <LoadingComponent/>}
    </Box>
  );
};

export default FamilyReligious;