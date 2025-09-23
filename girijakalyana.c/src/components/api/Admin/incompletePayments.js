import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "../authHooks";
import { toast } from "react-toastify";

// Get all incomplete payments with pagination and filtering
export const useAdminIncompletePayments = (params = {}) => {
  return useQuery({
    queryKey: ["admin-incomplete-payments", params],
    queryFn: async () => {
      const { page = 1, limit = 10, resolved = null, ticketRaised = null } = params;
      let url = `/api/admin/incomplete-payments?page=${page}&limit=${limit}`;
      
      if (resolved !== null) {
        url += `&resolved=${resolved}`;
      }
      if (ticketRaised !== null) {
        url += `&ticketRaised=${ticketRaised}`;
      }
      
      const response = await get(url);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch incomplete payments");
      }
      return response;
    },
    keepPreviousData: true,
  });
};

// Get a specific incomplete payment
export const useAdminIncompletePayment = (orderId) => {
  return useQuery({
    queryKey: ["admin-incomplete-payment", orderId],
    queryFn: async () => {
      const response = await get(`/api/admin/incomplete-payment/${orderId}`);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch incomplete payment");
      }
      return response;
    },
    enabled: !!orderId,
  });
};

// Resolve an incomplete payment
export const useResolveIncompletePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, data }) => {
      const response = await post(`/api/admin/resolve-incomplete-payment/${orderId}`, data);
      if (!response.success) {
        throw new Error(response.message || "Failed to resolve incomplete payment");
      }
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || "Payment resolved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-incomplete-payments"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resolve incomplete payment");
    },
  });
};

// Retry payment verification for an incomplete payment
export const useAdminRetryPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId }) => {
      const response = await post(`/api/admin/retry-payment/${orderId}`);
      if (!response.success) {
        throw new Error(response.message || "Failed to retry payment");
      }
      return response;
    },
    onSuccess: (response) => {
      toast.success(response.message || "Payment retry initiated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-incomplete-payments"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to retry payment");
    },
  });
};

// Get incomplete payment statistics
export const useIncompletePaymentStats = () => {
  return useQuery({
    queryKey: ["incomplete-payment-stats"],
    queryFn: async () => {
      const response = await get("/api/admin/incomplete-payments/stats");
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch incomplete payment stats");
      }
      return response;
    },
  });
};