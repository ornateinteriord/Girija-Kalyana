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
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import rawJsonData from "../Userprofile/profile/eduction/jsondata/data.json";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { toast } from "react-toastify";
import { useSignupMutation, useCheckPromocode } from "../api/Auth";

import { useLocation, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LoadingComponent } from "../../App";
import CustomAutocomplete from "../Autocomplete/CustomAutocomplete";
import { load } from "@cashfreepayments/cashfree-js";
import { post } from "../api/authHooks";
import { membershipOptions } from "../../assets/memberShipOptions/MemberShipPlans";

const datas = rawJsonData.reduce((acc, curr) => ({ ...acc, ...curr }), {});

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { mutate, isPending } = useSignupMutation();
  const searchParams = new URLSearchParams(location.search);
  const planType = searchParams.get("type"); // Changed from "plan" to "type" to match the navigation URL
  
  console.log("Location search:", location.search);
  console.log("Plan type from URL:", planType);
  console.log("All URL params:", Object.fromEntries(searchParams));
  
  // Promo code state
  const [promocode, setPromocode] = useState(searchParams.get("promocode") || "");
  const [isPromoApplied, setIsPromoApplied] = useState(!!searchParams.get("promocode"));
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  
  const checkPromocodeMutation = useCheckPromocode();

  const [citySuggestions, setCitySuggestions] = useState(datas.cities || []);
  const [talukSuggestions, setTalukSuggestions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const getUserRole = () => {
    console.log("getUserRole called with planType:", planType);
    switch (planType) {
      case "PremiumUser":
        return "PremiumUser";
      case "SilverUser":
        return "SilverUser";
      default:
        return "FreeUser";
    }
  };

  const initialFormState = {
    user_role: getUserRole(),
    marital_status: "",
    profilefor: "",
    gender: "",
    date_of_birth: "",
    age: "",
    educational_qualification: "",
    occupation: "",
    income_per_month: "",
    country: "",
    mother_tongue: "",
    name_of_parent: "",
    parent_name: "",
    religion: "Hindu",
    caste: "",
    address: "",
    occupation_country: "",
    state: "",
    city: "",
    first_name: "",
    last_name: "",
    username: "",
    mobile_no: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(() => ({
    user_role: getUserRole(),
    marital_status: "",
    profilefor: "",
    gender: "",
    date_of_birth: "",
    age: "",
    educational_qualification: "",
    occupation: "",
    income_per_month: "",
    country: "",
    mother_tongue: "",
    name_of_parent: "",
    parent_name: "",
    religion: "Hindu",
    caste: "",
    address: "",
    occupation_country: "",
    state: "",
    city: "",
    first_name: "",
    last_name: "",
    username: "",
    mobile_no: "",
    password: "",
    confirmPassword: "",
  }));

  useEffect(() => {
    console.log("planType changed to:", planType);
    setFormData((prev) => ({
      ...prev,
      user_role: getUserRole(),
    }));
  }, [planType]);

  useEffect(() => {
    if (formData.state) {
      const filteredCities =
        datas.cities?.filter((city) =>
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

    // For mobile number field - only allow numbers up to 10 digits
    if (name === "mobile_no") {
      if (value === "" || /^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // For age field - only allow numbers
    if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === "date_of_birth") {
      const age = calculateAge(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        age: age.toString(),
      }));
    } else if (name === "district") {
      const selectedDistrict = datas.districts?.find(
        (d) => d.name.toLowerCase() === value.toLowerCase()
      );
      setTalukSuggestions(selectedDistrict?.taluks || []);
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleClear = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(formData.mobile_no)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // For premium users, show payment dialog instead of direct registration
    if (planType === "PremiumUser" || planType === "SilverUser") {
      setPaymentDialogOpen(true);
    } else {
      // For free users, proceed with normal registration
      try {
        mutate(formData, {
          onSuccess: () => {
            toast.success("Registration successful");
          },
        });
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

  const handlePaymentConfirm = async () => {
    setIsProcessingPayment(true);
    setPaymentDialogOpen(false);

    try {
      // First, register the user with inactive status
      const registrationResponse = await post("/api/auth/signup", {
        ...formData,
        status: "inactive" // Set status to inactive initially
      });

      if (registrationResponse.success) {
        // Create payment order using membershipOptions
        const orderId = "order_" + Date.now();
        const planName = planType === "PremiumUser" ? "PREMIUM MEMBERSHIP" : "SILVER MEMBERSHIP";
        const plan = membershipOptions.find(p => p.name === planName);
        
        const originalAmount = parseInt(plan.discountedPrice.replace('₹', '').replace(',', ''));
        const finalAmount = promocode ? Math.max(originalAmount - 100, 0) : originalAmount;
        const planTypeCode = planType === "PremiumUser" ? 'premium' : 'silver';

        const orderResponse = await post("/api/payment/create-order", {
          orderId,
          orderAmount: finalAmount,
          customerName: formData.first_name + " " + formData.last_name,
          customerEmail: formData.username,
          customerPhone: formData.mobile_no,
          planType: planTypeCode,
          promocode: promocode || null,
          originalAmount,
          // Add context to indicate this is a registration
          context: "registration"
        });

        if (orderResponse?.payment_session_id) {
          // Store the order ID and timestamp in localStorage for later verification
          localStorage.setItem('pendingOrderId', orderId);
          localStorage.setItem(`orderTimestamp_${orderId}`, Date.now().toString());
          
          // Initialize Cashfree payment in the same tab
          const cashfree = await load({ mode: "sandbox" }); // Change to "production" for live
          
          // Start payment process in the same tab
          cashfree.checkout({
            paymentSessionId: orderResponse.payment_session_id,
            redirectTarget: "_self" // Open in same tab
            // Removed returnUrl as it's set in the backend
          });
        } else {
          throw new Error("Failed to create payment order");
        }
      } else {
        throw new Error(registrationResponse.message || "Registration failed");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error(error.message || "Failed to initiate payment. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const isValidAge = (value) => {
    if (value === "") return true; // Allow empty field
    return /^\d+$/.test(value); // Check if it's only digits
  };

  // Calculate plan amounts for display using membershipOptions
  const getPlanDetails = () => {
    if (planType === "PremiumUser") {
      const plan = membershipOptions.find(p => p.name === 'PREMIUM MEMBERSHIP');
      const originalPrice = parseInt(plan.discountedPrice.replace('₹', '').replace(',', ''));
      const discountedPrice = isPromoApplied ? Math.max(originalPrice - 100, 0) : originalPrice;
      return { originalPrice, discountedPrice, displayPrice: plan.discountedPrice };
    } else if (planType === "SilverUser") {
      const plan = membershipOptions.find(p => p.name === 'SILVER MEMBERSHIP');
      const originalPrice = parseInt(plan.discountedPrice.replace('₹', '').replace(',', ''));
      const discountedPrice = isPromoApplied ? Math.max(originalPrice - 100, 0) : originalPrice;
      return { originalPrice, discountedPrice, displayPrice: plan.discountedPrice };
    }
    return { originalPrice: 0, discountedPrice: 0, displayPrice: '₹0' };
  };

  const { originalPrice, discountedPrice } = getPlanDetails();

  // Handle promocode application
  const handleApplyPromocode = () => {
    if (!promocode.trim()) {
      return;
    }

    checkPromocodeMutation.mutate(
      { promocode: promocode.trim() },
      {
        onSuccess: (response) => {
          setIsPromoApplied(true);
          // Update URL with promocode without reloading the page
          const newSearchParams = new URLSearchParams(location.search);
          newSearchParams.set("promocode", promocode.trim());
          navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
          setPromoDialogOpen(false);
          toast.success("Promocode applied successfully! ₹100 discount applied.");
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Invalid promocode");
          setIsPromoApplied(false);
        }
      }
    );
  };

  const handleRemovePromocode = () => {
    setPromocode("");
    setIsPromoApplied(false);
    // Remove promocode from URL
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete("promocode");
    navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
  };

  const handleOpenPromoDialog = () => {
    setPromoDialogOpen(true);
  };

  const handleClosePromoDialog = () => {
    setPromoDialogOpen(false);
  };



  return (
    <>
      <Navbar />
      {isPending && <LoadingComponent />}
      <Box
        sx={{
          minHeight: "100vh",
          py: 4,
          px: { xs: 1, sm: 2 },
          mt: "10px",
          width: isMobile ? "100%" : "85%",
          display: "flex",
          justifyContent: "center",
          justifySelf: "center",
        }}
      >
        <Box
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
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: isMobile ? "15px" : "",
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <HowToRegIcon />
              </Avatar>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                sx={{ fontWeight: 500 }}
              >
                Register Here!
              </Typography>
            </Box>

            <Box
              sx={{
                fontSize: { xs: "18px", sm: "22px" },
                backgroundColor: "transparent",
                color: "black",
                py: 1,
                borderRadius: 1,
                fontWeight: 500,
              }}
            >
              Registering as:{" "}
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                }}
              >
                {getUserRole()}
              </Box>
            </Box>
          </Box>

          {/* Promo code display with visual feedback */}
          {planType && (planType === "PremiumUser" || planType === "SilverUser") && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: isPromoApplied ? "#e8f5e8" : "#f5f5f5",
                border: isPromoApplied ? "1px solid #4caf50" : "1px solid #e0e0e0",
                textAlign: "center",
                position: "relative",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {planType === "PremiumUser" ? "Premium" : "Silver"} Membership
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                {isPromoApplied ? (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      {getPlanDetails().displayPrice}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#4caf50",
                        fontWeight: "bold",
                      }}
                    >
                      ₹{discountedPrice}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4caf50",
                        fontWeight: "bold",
                        ml: 1,
                      }}
                    >
                      (Promo Applied)
                    </Typography>
                    <Button 
                      size="small" 
                      onClick={handleRemovePromocode}
                      sx={{ 
                        ml: 2,
                        color: "#f44336",
                        minWidth: "auto",
                        padding: "2px 8px",
                        fontSize: "0.75rem"
                      }}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Typography variant="h6">{getPlanDetails().displayPrice}</Typography>
                )}
              </Box>
              {!isPromoApplied && (
                <Button 
                  size="small" 
                  onClick={handleOpenPromoDialog}
                  sx={{ 
                  mt: 2,
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: "primary.main",
                  minWidth: "auto",
                  padding: "4px 12px",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  mr : 2,
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
                >
                  Have a promocode? Apply here
                </Button>
              )}
              
              <Button 
                size="small" 
                onClick={() => {
                  // Reset all plan-related states
                  setIsPromoApplied(false);
                  setPromocode("");
                  
                  // Remove plan and promocode from URL
                  const newSearchParams = new URLSearchParams(location.search);
                  newSearchParams.delete("plan");
                  newSearchParams.delete("promocode");
                  
                  // Navigate to clean register page
                  navigate(`/register`, { replace: true });
                }}
                sx={{ 
                  mt: 2,
                  color: "error.main",
                  border: "1px solid",
                  borderColor: "error.main",
                  minWidth: "auto",
                  padding: "4px 12px",
                  fontSize: "0.875rem",
                  textTransform: "none",
                  '&:hover': {
                    backgroundColor: 'error.main',
                    color: 'white'
                  }
                }}
              >
                Remove Plan & Register as FreeUser
              </Button>
            </Box>
          )}

          <Divider sx={{ height: "1px", mb: isMobile ? 1 : 2 }} />

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

              <FormControl fullWidth sx={{ mb: 3 }} required>
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

              <FormControl fullWidth sx={{ mb: 3 }} required>
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

              <FormControl  fullWidth sx={{ mb: 3 }} required>
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
                type="text" // Changed from "number" to "text"
                sx={{ mb: 3 }}
                name="age"
                value={formData.age}
                onChange={handleChange}
                InputLabelProps={{ shrink: !!formData.age }}
                error={!isValidAge(formData.age)} // Show error state if not valid
                helperText={
                  !isValidAge(formData.age) ? "Please enter a valid number" : ""
                }
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
                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.qualificationValues ?? []}
                    label="Educational Qualification"
                    name="educational_qualification"
                    value={formData.educational_qualification}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.occupationValues ?? []}
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>

                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.incomeValues ?? []}
                    label="Income Per Annum"
                    name="income_per_month"
                    value={formData.income_per_month}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.countries ?? []}
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>

                <Box sx={{ flex: "1 1 48%", minWidth: "200px" }}>
                  <CustomAutocomplete
                    options={datas.languageValues ?? []}
                    label="Mother Tongue"
                    name="mother_tongue"
                    value={formData.mother_tongue}
                    onChange={handleChange}
                    sx={{ width: "100%", mb: 2 }}
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
                type="text" // Changed from "number" to "text" for better control
                name="mobile_no"
                sx={{ mb: 3 }}
                value={formData.mobile_no}
                onChange={handleChange}
                required
                inputProps={{
                  maxLength: 10, // Limit to 10 digits for Indian numbers
                  pattern: "[0-9]*", // Ensures only numbers are entered
                }}
                error={
                  formData.mobile_no && !/^[0-9]{10}$/.test(formData.mobile_no)
                }
                helperText={
                  formData.mobile_no && !/^[0-9]{10}$/.test(formData.mobile_no)
                    ? "Please enter a valid 10-digit mobile number"
                    : ""
                }
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
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              flexDirection: isMobile ? "row" : "row",
            }}
          >
            <input type="hidden" name="user_role" value={formData.user_role} />
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={handleClear}
              sx={{
                fontWeight: 600,
                width: { xs: "100%", sm: "50%", md: "20%" },
                textTransform: "capitalize",
                color: "#fff",
                background: "#1a4f72",
                "&:hover": {
                  background: "#245a7e",
                },
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending || isProcessingPayment}
              sx={{
                backgroundColor: "#27ae60",
                "&:hover": { backgroundColor: "#1e8449" },
                fontWeight: 600,
                width: { xs: "100%", sm: "50%", md: "20%" },
                textTransform: "capitalize",
              }}
            >
              {isProcessingPayment ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography>
            You have selected {planType === "PremiumUser" ? "Premium" : "Silver"} membership.
            After submitting your details, you will be redirected to the payment gateway.
            Your account will be activated after successful payment and admin verification.
          </Typography>
          {promocode && (
            <Typography sx={{ mt: 2, color: 'success.main' }}>
              Promocode applied: {promocode} (₹100 discount)
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePaymentConfirm} variant="contained" color="primary">
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Promocode Dialog */}
      <Dialog open={promoDialogOpen} onClose={handleClosePromoDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          Apply Promocode
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Enter your promocode to get ₹100 discount on your membership plan.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Promocode"
            fullWidth
            variant="outlined"
            value={promocode}
            onChange={(e) => setPromocode(e.target.value)}
            disabled={checkPromocodeMutation.isPending}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClosePromoDialog}
            disabled={checkPromocodeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyPromocode}
            disabled={!promocode.trim() || checkPromocodeMutation.isPending}
            startIcon={
              checkPromocodeMutation.isPending ? (
                <CircularProgress size={20} />
              ) : null
            }
            sx={{
              minWidth: 120,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #0288D1 90%)",
              },
            }}
          >
            {checkPromocodeMutation.isPending ? "Checking..." : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Register;