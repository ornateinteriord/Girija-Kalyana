import { useEffect, useState } from "react";
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
  useTheme,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import rawJsonData from "../Userprofile/profile/eduction/jsondata/data.json";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { toast } from "react-toastify";
import { useSignupMutation } from "../api/Auth";
import { useLocation } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LoadingComponent } from "../../App";
import CustomAutocomplete from "../Autocomplete/CustomAutocomplete";


const datas = rawJsonData.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const Register = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mutate, isPending } = useSignupMutation();
  const searchParams = new URLSearchParams(location.search);
  const planType = searchParams.get("type");

  const [citySuggestions, setCitySuggestions] = useState(datas.cities || []);
  const [talukSuggestions, setTalukSuggestions] = useState([]);

  const getUserRole = () => {
    switch (planType) {
      case "PremiumUser":
        return "PremiumUser";
      case "SilverUser":
        return "SilverUser";
      default:
        return "FreeUser";
    }
  };

  const [formData, setFormData] = useState({
    user_role: getUserRole(),
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      user_role: getUserRole(),
    }));
  }, [planType]);

  useEffect(() => {
    if (formData.state) {
      const filteredCities = datas.cities?.filter(city => 
        city.toLowerCase().includes(formData.state.toLowerCase())
      ) || [];
      setCitySuggestions(filteredCities);
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.district) {
      const selectedDistrict = datas.districts?.find(
        (d) => d.name.toLowerCase() === formData.district.toLowerCase()
      );
      setTalukSuggestions(selectedDistrict?.taluks || []);
    }
  }, [formData.district]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'district') {
      const selectedDistrict = datas.districts?.find(
        (d) => d.name.toLowerCase() === value.toLowerCase()
      );
      setTalukSuggestions(selectedDistrict?.taluks || []);
    }

    if (name === "date_of_birth") {
      const age = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        age: age.toString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      mutate(formData, {
        onSuccess: () => {
          toast.success(formData.message);
        },
      });
    } catch (error) {}
  };

  return (
    <>
      <Navbar />
      {isPending && <LoadingComponent />}
      <Box
        sx={{
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          py: 4,
          px: { xs: 1, sm: 2 },
          mt: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2, sm: 4, md: 6 },
            borderRadius: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              mt: 0.5,
              gap: 2,
              flexDirection: "row",
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <HowToRegIcon />
            </Avatar>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              sx={{ fontWeight: 600, textAlign: "center" }}
            >
              REGISTER HERE!
            </Typography>

          </Box>

    <Divider sx={{ height: "1px", mb: isMobile ? 1 : 2 }} />
  <Box
  sx={{
    fontSize: '22px',
    backgroundColor:"transparent",
    color: 'black',
    py: 1,
    mb: 0,
    borderRadius: 1,
    textAlign: 'center',
    fontWeight: 'bold',

  }}
>
  Registering as:{' '}
  <Box 
    component="span"
    sx={{
      color: theme =>
        planType === 'SilverUser' ? theme.palette.secondary.main :
        planType === 'PremiumUser' ? '#FFD700' : 
        '#000',
      textTransform: 'capitalize'  
    }}
  >
    {getUserRole()}
  </Box>
</Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
              >
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
                  {datas.marritalStatus?.map((item, idx) => (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
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
                  <MenuItem value="BrideGroom">Male</MenuItem>
                  <MenuItem value="Bride">Female</MenuItem>
                  
                </Select>
              </FormControl>

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

              <TextField
                fullWidth
                label="Age"
                type="number"
                sx={{ mb: 3 }}
                name="age"
                value={formData.age}
                onChange={handleChange}
                InputLabelProps={{ shrink: !!formData.age }}
              />

              <Typography
                variant="h6"
                sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
              >
               SOCIAL & CAREER DETAILS
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: '1 1 48%', minWidth: '200px' }}>
                  <CustomAutocomplete
                    options={datas.qualificationValues??[]}
                    label="Educational Qualification"
                    name="educational_qualification"
                    value={formData.educational_qualification}
                    onChange={handleChange}
                    sx={{ width: '100%', mb: 2 }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 48%', minWidth: '200px' }}>
                  <CustomAutocomplete
                    options={datas.occupationValues ?? []}
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    sx={{ width: '100%', mb: 2 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 48%', minWidth: '200px' }}>
                  <CustomAutocomplete
                    options={datas.incomeValues??[]}
                    label="Income Per Annum"
                    name="income_per_month"
                    value={formData.income_per_month}
                    onChange={handleChange}
                    sx={{ width: '100%', mb: 2 }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 48%', minWidth: '200px' }}>
                  <CustomAutocomplete
                    options={datas.countries ?? []}
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    sx={{ width: '100%', mb: 2 }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 48%', minWidth: '200px' }}>
                  <CustomAutocomplete
                    options={datas.languageValues  ?? []}
                    label="Mother Tongue"
                    name="mother_tongue"
                    value={formData.mother_tongue}
                    onChange={handleChange}
                    sx={{ width: '100%', mb: 2 }}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
              >
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

              <CustomAutocomplete
                options={datas.casteValues ?? []}
                label="Caste"
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

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

              <CustomAutocomplete
                options={datas.countries ?? []}
                label="Occupation Country"
                name="occupation_country"
                value={formData.occupation_country}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <CustomAutocomplete
                options={datas.states || []}
                label="Select State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

              <CustomAutocomplete
                options={citySuggestions}
                label="Select City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />

            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{ mt: 1, mb: 3, color: "primary.main", fontWeight: 600 }}
          >
            LOGIN DETAILS
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                sx={{ mb: 3 }}
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                sx={{ mb: 3 }}
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
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
                required
              />
              <TextField
                fullWidth
                label="Mobile Number"
                type="number"
                name="mobile_no"
                sx={{ mb: 3 }}
                value={formData.mobile_no}
                onChange={handleChange}
                required
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 4,
            }}
          >
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

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input type="hidden" name="user_role" value={formData.user_role} />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
              sx={{
                backgroundColor: "orange",
                "&:hover": { backgroundColor: "darkorange" },
                fontWeight: 600,
                width: { xs: "100%", sm: "50%", md: "30%" },
                textTransform: "capitalize",
              }}
            >
              Registration Submit
            </Button>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  );
};

export default Register;