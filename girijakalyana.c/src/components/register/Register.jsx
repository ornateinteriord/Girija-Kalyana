import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import rawJsonData from "../Userprofile/profile/eduction/jsondata/data.json";
import Navbar from '../navbar/Navbar';
import Footer from "../footer/Footer";
import { toast } from 'react-toastify'; 
import { useSignupMutation } from '../api/Auth';

const datas = rawJsonData.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const signupmutation = useSignupMutation();
  const { mutate } = signupmutation;

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      mutate(formData, {
        onSuccess: () => {
          toast.success(formData.message);
        },
      });
    } catch (error) {
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ 
        backgroundColor: '#f5f7fa', 
        minHeight: '100vh', 
        py: 4, 
        px: { xs: 1, sm: 2 }, 
        mt: '10px', 
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{ 
            p: { xs: 2, sm: 4, md: 6 }, 
            borderRadius: 2, 
            width: '100%', 
            // maxWidth: '1400px'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 2, 
            mt:1.5,          
             gap: 2,
            flexDirection: 'row'
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <HowToRegIcon />
            </Avatar>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1" sx={{ fontWeight: 600, textAlign: 'center' }}>
              REGISTER HERE!
            </Typography>
          </Box>

          <Divider sx={{ height: '1px', mb:isMobile? 1 : 4 }} />

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4 
          }}>
            {/* LEFT: Personal + Social */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                PERSONAL DETAILS
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  label="Marital Status"
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                >
                  {datas.marritalStatus.map((item, idx) => (
                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Create Profile For</InputLabel>
                <Select
                  label="Create Profile For"
                  name="profilefor"
                  value={formData.profilefor}
                  onChange={handleChange}
                >
                  <MenuItem value="Self">Self</MenuItem>
                  <MenuItem value="Son">Son</MenuItem>
                  <MenuItem value="Daughter">Daughter</MenuItem>
                  <MenuItem value="Brother">Brother</MenuItem>
                  <MenuItem value="Sister">Sister</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                type="date"
                InputLabelProps={{ shrink: true }}
                required
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Age"
                type="number"
                sx={{ mb: 3 }}
                name="age"
                value={formData.age}
                onChange={handleChange}
              />

              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                SOCIAL & CAREER DETAILS
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2,
                '& .MuiFormControl-root': {
                  flex: isMobile ? '1 1 100%' : '1 1 48%',
                  minWidth: '120px'
                }
              }}>
                <FormControl sx={{ mb: 2 }}>
                  <InputLabel>Educational Qualification</InputLabel>
                  <Select
                    label="Educational Qualification"
                    name="educational_qualification"
                    value={formData.educational_qualification}
                    onChange={handleChange}
                  >
                    {datas.qualificationValues.map((item, idx) => (
                      <MenuItem key={idx} value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ mb: 2 }}>
                  <InputLabel>Occupation</InputLabel>
                  <Select
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  >
                    {datas.occupationValues.map((item, idx) => (
                      <MenuItem key={idx} value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ mb: 2 }}>
                  <InputLabel>Income Per Annum</InputLabel>
                  <Select
                    label="Income Per Annum"
                    name="income_per_month"
                    value={formData.income_per_month}
                    onChange={handleChange}
                  >
                    {datas.incomeValues.map((item, idx) => (
                      <MenuItem key={idx} value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ mb: 2 }}>
                  <InputLabel>Country</InputLabel>
                  <Select
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    {datas.countries.map((item, idx) => (
                      <MenuItem key={idx} value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ mb: 3 }}>
                  <InputLabel>Mother Tongue</InputLabel>
                  <Select
                    label="Mother Tongue"
                    name="mother_tongue"
                    value={formData.mother_tongue}
                    onChange={handleChange}
                  >
                    {datas.languageValues.map((item, idx) => (
                      <MenuItem key={idx} value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* RIGHT: Family + Login */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                FAMILY DETAILS
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Parents</InputLabel>
                <Select
                  label="Select Parents"
                  name="name_of_parent"
                  value={formData.name_of_parent}
                  onChange={handleChange}
                >
                  <MenuItem value="Father">Father</MenuItem>
                  <MenuItem value="Mother">Mother</MenuItem>
                  <MenuItem value="Guardian">Guardian</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Please enter name"
                name="parent_name"
                sx={{ mb: 3 }}
                value={formData.parent_name}
                onChange={handleChange}
              />
              
              <TextField
                fullWidth
                label="Religion"
                name="religion"
                value="Hindu"
                disabled
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Caste</InputLabel>
                <Select
                  label="Caste"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                >
                  {datas.casteValues.map((item, idx) => (
                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                sx={{ mb: 3 }}
                value={formData.address}
                onChange={handleChange}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Occupation Country</InputLabel>
                <Select
                  label="Country"
                  name="occupation_country"
                  value={formData.occupation_country}
                  onChange={handleChange}
                >
                  {datas.countries.map((item, idx) => (
                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select State</InputLabel>
                <Select
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {datas.states.map((item, idx) => (
                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select City</InputLabel>
                <Select
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                >
                  {datas.cities.map((item, idx) => (
                    <MenuItem key={idx} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* LOGIN DETAILS */}
          <Typography variant="h6" sx={{ mt: 1, mb: 3, color: 'primary.main', fontWeight: 600 }}>
            LOGIN DETAILS
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2 
          }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                sx={{ mb: 3 }}
                value={formData.first_name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Last Name"
                sx={{ mb: 3 }}
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="username"
                sx={{ mb: 3 }}
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Mobile Number"
                type="tel"
                name="mobile_no"
                sx={{ mb: 3 }}
                value={formData.mobile_no}
                onChange={handleChange}
              />
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            mb: 4 
          }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Box>
          
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'orange',
                '&:hover': { backgroundColor: 'darkorange' },
                fontWeight: 600,
                width: { xs: '100%', sm: '50%', md: '30%' },
                textTransform: 'capitalize'
              }}
            >
              Submit Registration
            </Button>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  );
};

export default Register;