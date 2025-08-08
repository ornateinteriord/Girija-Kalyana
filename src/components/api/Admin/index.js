// hooks/useUserProfileQuery.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { get, post, put } from "../authHooks";
import { toast } from "react-toastify";

export const getAllUserProfiles = () => {
   return useMutation({
    mutationFn: async ({ page, pageSize }) => {
      const response = await post("/api/admin/all-user-details", {
        page,
        pageSize,
      });
      if (response?.success) {
        return response;
      
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
  });
};

export const UpgradeUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ regno, status, image_verification,isProfileUpdate }) => {
      const response = await put(`/api/admin/upgrade-user/${regno}`, {
        status,
        image_verification,
        isProfileUpdate
      });
      return response;
    },
    onSuccess: (response) => {
      if (response?.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
      } else {
        toast.error(response?.message);
      }
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};

export const UserResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ regno, password }) => {
      const response = await put(`/api/admin/reset-password/${regno}`, {
        password,
      });
      return response;
    },
    onSuccess: (response) => {
      if (response?.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["profiles"] });
      } else {
        toast.error(response?.message);
      }
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};

export const getAllAssistanceTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await get("/api/admin/all-Assistance-transactions");
      if (response.success) {
        return response.transactions;
      } else {
        throw new Error(response.message);
      }
    },
  });
};
export const getAllUserCounts = () => {
  return useQuery({
    queryKey: ["user-counts"],
    queryFn: async () => {
      const response = await get("/api/admin/dashboard-stats");
      if (response.success) {
        return response.counts;
      } else {
        throw new Error(response.message);
      }
    },
  });
};
export const getAllAssistancePending = () => {
 return useMutation({
    mutationFn: async ({ page, pageSize }) => {
      const response = await post("/api/admin/assistance-pending", {
        page,
        pageSize,
      });
      if (response?.success) {
        return response;
      
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
  });
};
export const getAllAssistanceSuccess = () => {
   return useMutation({
    mutationFn: async ({ page, pageSize }) => {
      const response = await post("/api/admin/assistance-success", {
        page,
        pageSize,
      });
      if (response?.success) {
        return response;
      
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
  });
};
export const useOnlineTransactions = () => {
  return useQuery({
    queryKey: ["online-transactions"],
    queryFn: async () => {
      const response = await get("/api/admin/online-transactions");

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch online transactions"
        );
      }

      console.log("API response:", response);
      return response.data; // This should be your array of transactions
    },
  });
};

export const usePromotersEarnings = () => {
  return useQuery({
    queryKey: ['promoters-earnings'],
    queryFn: async () => {
      const response = await get('/api/admin/all-promoters-earnings'); // <-- Match your backend route
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch promoter earnings');
      }
      return response.Earnings;
    },
  });
};

export const usePromotersTransactions = () => {
  return useQuery({
    queryKey: ['promoters-transactions'],
    queryFn: async () => {
      const response = await get('/api/admin/all-promoters-transactions');
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch promoter transactions');
      }
      return response.Transactions;
    },
  });
};

export const usePromoters = () => {
  return useQuery({
    queryKey: ['promoters'],
    queryFn: async () => {
      const response = await get('/api/admin/all-promoters');
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch promoters');
      }
      return response.Promoters; 
    },
  });
};


export const useUpdatePromoterStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await put(`/api/admin/promoters/${id}/status`, { status });
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["promoters"] });
      } else {
        toast.error(data.message || "Failed to update status");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error updating status");
    },
  });
};

export const getAllNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const response = await get("/api/admin/all-news");
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    },
  });
};


export const useAddNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await post("/api/admin/add-news",formData);
      return response;
    },
    onSuccess: (response) => {
      if (response?.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["news"] });
      } else {
        toast.error(response?.message);
      }
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
