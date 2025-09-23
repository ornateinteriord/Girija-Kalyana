import { get, post } from "../authHooks";

// Raise a ticket for an incomplete payment
export const raiseIncompletePaymentTicket = async (orderId, formData) => {
  return await post(`/api/incomplete-payment/raise-ticket/${orderId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Get incomplete payments for user
export const getUserIncompletePayments = async (userId) => {
  return await get(`/api/user/incomplete-payments?userId=${userId}`);
};

// Get incomplete payments for admin
export const getAdminIncompletePayments = async (page = 1, limit = 10, resolved = null, ticketRaised = null) => {
  let url = `/api/incomplete-payment/admin/incomplete-payments?page=${page}&limit=${limit}`;
  if (resolved !== null) {
    url += `&resolved=${resolved}`;
  }
  if (ticketRaised !== null) {
    url += `&ticketRaised=${ticketRaised}`;
  }
  return await get(url);
};

// Get a specific incomplete payment for admin
export const getAdminIncompletePayment = async (orderId) => {
  return await get(`/api/incomplete-payment/admin/incomplete-payment/${orderId}`);
};