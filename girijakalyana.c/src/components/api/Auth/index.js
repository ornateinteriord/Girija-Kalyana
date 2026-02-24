import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import TokenService from "../../token/tokenService";
import { get, post } from "../authHooks";
import { useCheckPromocode } from "../Payment";

export const useSignupMutation = ()=>{
  const navigate = useNavigate();
  return useMutation({
      mutationFn: async (data) => {
        return await post("/api/auth/signup", data);
      },
      onSuccess: (response) => {
        if (response.success) {
          // For premium users, don't automatically set token or navigate
          // They will be redirected to payment and then to activation pending
          if (response.user?.type_of_user === "PremiumUser" || response.user?.type_of_user === "SilverUser") {
            // Token might not be set for premium users as they need to complete payment first
            // Navigation will be handled by the payment flow
            toast.success("Registration successful. Please complete payment to activate your account.");
          } else {
            // For free users, proceed with normal flow
            TokenService.setToken(response.token);
            window.dispatchEvent(new Event("storage")); 
            toast.success(response.message);
            navigate("/activation-pending");
          }
        } else {
          console.error(response.message);
        }
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
}

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      return await post("/api/auth/login", data);
    },

    onSuccess: (response) => {
      if (response?.success && response?.token) {
        TokenService.setToken(response.token);
        window.dispatchEvent(new Event("storage")); 

        const userStatus = response?.user?.status;
        const role = TokenService.getRole();

        if (role === "promoter") {
          navigate("/promoter/dashboard");
        } else if (userStatus === "active") {
          navigate("/user/userDashboard");
        } else {
          navigate("/activation-pending");
        }
      } else if (response?.success === false) {
        toast.error(response?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "An error occurred during login");
    },
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data) => {
      return await post("/api/auth/reset-password", data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        navigate("/login");
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reset password");
    },
  });
};

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await get("/api/auth/dashboardstats");
      return response.stats;
    },
  });
};

export const useGetRecentRegisters = () => {
  return useQuery({
    queryKey: ["recent-registers"],
    queryFn: async () => {
      const response = await get("/api/auth/recentregisters");
      return response;
    },
  });
};

// Export the promocode hook
export { useCheckPromocode };