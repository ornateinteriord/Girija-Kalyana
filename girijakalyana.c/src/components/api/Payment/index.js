import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { post } from "../authHooks";

// Hook for creating payment order
export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: async ({ orderId, orderAmount, customerName, customerEmail, customerPhone, planType, promocode, originalAmount }) => {
      const response = await post("/api/payment/create-order", {
        orderId,
        orderAmount,
        customerName,
        customerEmail,
        customerPhone,
        planType,
        promocode,
        originalAmount,
      });
      
      if (response?.payment_session_id) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to create payment order");
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error.message;
      toast.error(`Payment order creation failed: ${errorMessage}`);
    },
  });
};

// Hook for verifying payment manually (fallback if webhook fails)
export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async ({ orderId }) => {
      // Validate order ID before sending
      if (!orderId || orderId.includes('{') || orderId.includes('}') || 
          orderId.includes('KTAqpwFjFCDenUW6j_Yo1xEJv9-Y5Ng_42YTJk9YQt4N0EW7yy3nOgEpayment')) {
        throw new Error('Invalid order ID');
      }
      
      const response = await post(`/api/payment/verify-payment/${orderId}`, {});
      return response;
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Payment verified successfully! Your subscription has been updated.");
      } else if (response.orderStatus === 'PAID' && response.paymentStatus === 'SUCCESS') {
        // Already processed successfully
        toast.info("Payment already processed successfully.");
      } else if (response.orderStatus === 'PAID' && response.paymentStatus === 'PENDING') {
        // Payment is processing, show message
        toast.info(response.message || "Payment is being processed. Please wait...");
      } else if (response.orderStatus === 'PAID' && response.paymentStatus !== 'SUCCESS') {
        // Payment processing but not yet confirmed
        toast.info(response.message || "Payment is being processed. Please wait...");
      } else {
        // Payment not completed
        toast.info(response.message || "Payment was not completed. If you wish to proceed with payment, please try again.");
      }
    },
    onError: (error) => {
      // If it's an invalid order ID error, redirect to clean dashboard
      if (error.message === 'Invalid order ID') {
        window.history.replaceState({}, document.title, '/user/userDashboard');
        toast.info('Payment processing. If not redirected automatically, please refresh the page.');
        return;
      }
      
      const errorMessage = error?.response?.data?.error || error.message;
      toast.error(`Payment verification failed: ${errorMessage}`);
    },
    // Prevent multiple simultaneous calls for the same mutation
    retry: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};

// Hook for retrying payment verification
export const useRetryPayment = () => {
  return useMutation({
    mutationFn: async ({ orderId }) => {
      // Validate order ID before sending
      if (!orderId || orderId.includes('{') || orderId.includes('}') || 
          orderId.includes('KTAqpwFjFCDenUW6j_Yo1xEJv9-Y5Ng_42YTJk9YQt4N0EW7yy3nOgEpayment')) {
        throw new Error('Invalid order ID');
      }
      
      const response = await post(`/api/payment/retry-payment/${orderId}`, {});
      return response;
    },
    onSuccess: (response) => {
      console.log('Retry payment response:', response);
      if (response.success) {
        toast.success("Payment verified successfully! Your subscription has been updated.");
      } else if (response.alreadyProcessed) {
        toast.info("Payment already processed successfully.");
      } else if (response.orderStatus === 'PAID' && response.paymentStatus === 'NOT_ATTEMPTED') {
        // Special case: Order is PAID but payment status is NOT_ATTEMPTED
        toast.info("Still verifying payment completion. This may take a few moments...");
        // We could retry again here, but let's avoid infinite loops
      } else if (response.orderStatus === 'PAID' && response.paymentStatus === 'PENDING') {
        // Payment still processing
        toast.info(response.message || "Payment is still being processed. Please wait...");
      } else if (response.orderStatus === 'PAID') {
        // Order is PAID but payment status is not SUCCESS - this might be a timing issue
        toast.info(response.message || "Payment is being processed. Checking again in a moment...");
        // Retry verification after 5 seconds
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        // Payment not completed
        toast.info(response.message || "Payment was not completed. If you wish to proceed with payment, please try again.");
      }
    },
    onError: (error) => {
      console.error('Payment retry error:', error);
      
      // If it's an invalid order ID error, redirect to clean dashboard
      if (error.message === 'Invalid order ID') {
        window.history.replaceState({}, document.title, '/user/userDashboard');
        toast.info('Payment processing. If not redirected automatically, please refresh the page.');
        return;
      }
      
      const errorMessage = error?.response?.data?.error || error.message;
      toast.error(`Payment retry failed: ${errorMessage}`);
    },
    // Prevent multiple simultaneous calls for the same mutation
    retry: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};

export const useCheckPaymentStatus = () => {
  return useMutation({
    mutationFn: async ({ orderId }) => {
      const response = await get(`/api/payment/payment-status/${orderId}`);
      return response;
    },
    onError: (error) => {
      console.error('Check payment status error:', error);
      const errorMessage = error?.response?.data?.error || error.message;
      toast.error(`Failed to check payment status: ${errorMessage}`);
    }
  });
};

// Hook for manually reporting incomplete payments
export const useReportIncompletePayment = () => {
  return useMutation({
    mutationFn: async ({ orderId, description }) => {
      const response = await post(`/api/payment/report-incomplete/${orderId}`, {
        description
      });
      return response;
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Payment issue reported successfully. Our team will review it.");
      } else {
        toast.error(response.message || "Failed to report payment issue.");
      }
    },
    onError: (error) => {
      console.error('Report incomplete payment error:', error);
      const errorMessage = error?.response?.data?.error || error.message;
      toast.error(`Failed to report payment issue: ${errorMessage}`);
    },
  });
};

// Hook for checking promocode validity  
export const useCheckPromocode = () => {
  return useMutation({
    mutationFn: async ({ promocode }) => {
      const response = await post("/api/promoter/promocheck", {
        promocode,
      });
      
      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Invalid promocode");
      }
    },
    onSuccess: (response) => {
      toast.success(response.message || "Promocode applied successfully! ₹100 discount applied.");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error.message;
      toast.error(errorMessage || "Invalid promocode");
    },
  });
};

// Hook for raising incomplete payment tickets
export const useRaiseTicket = () => {
  return useMutation({
    mutationFn: async ({ orderId, description, images }) => {
      const formData = new FormData();
      formData.append('description', description);
      
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      const response = await post(`/api/incomplete-payment/raise-ticket/${orderId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to raise ticket");
      }
    },
    onSuccess: (response) => {
      toast.success("Ticket raised successfully! Our team will review your issue.");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error.message;
      toast.error(errorMessage || "Failed to raise ticket");
    },
  });
};