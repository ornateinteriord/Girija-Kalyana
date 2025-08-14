import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import TokenService from "../../token/tokenService";
import { get, post } from "../authHooks";

export const useSignupMutation = ()=>{
  const navigate = useNavigate();
  return useMutation({
      mutationFn: async (data) => {
        return await post("/api/auth/signup", data);
      },
      onSuccess: (response) => {
        if (response.success) {
          TokenService.setToken(response.token);
       window.dispatchEvent(new Event("storage")); 
          toast.success(response.message);
          navigate("/activation-pending");
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

        if (userStatus !== "active") {
          toast.info(response.message || "Your account is not yet active");
        navigate("/activation-pending");
          return;
        }

        toast.success(response.message );

        switch (role) {
          case "FreeUser":
          case "PremiumUser":
          case "SilverUser":
          case "Assistance":
            navigate("/user/userDashboard");
            break;
          case "Admin":
            navigate("/admin/dashboard");
            break;
          case "promoter":
            navigate("/PromotAdmin");
            break;
          default:
            localStorage.clear();
            toast.error("Invalid user role");
        }
      } else {
        toast.error(response?.message);
        console.error("Login failed:", response?.message);
      }
    },

    onError: (error) => {
      toast.error(error?.message);
      console.error("Login error:", error);
    }
  });
};


export const useResetpassword = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await post("/api/auth/reset-password", data);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
   onError: (error) => {
  const errorMessage =
    error?.response?.data?.message || "Something went wrong";
  toast.error(errorMessage);
}
  });
};

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardstats"],
    queryFn: async () => {
      const data = await get("/api/auth/dashboardstats")
      return data;
    },
  });
};
export const useGetRecentRegisters = () => {
  return useQuery({
    queryKey: ["recentregisters"],
    queryFn: async () => {
      const data = await get("/api/auth/recentregisters")
      return data;
    },
  });
};
