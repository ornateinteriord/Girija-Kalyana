import { get, post } from "../authHooks";

// Get incomplete payments
export const getIncompletePayments = async (page = 1, limit = 10, resolved = null) => {
  let url = `/api/admin/incomplete-payments?page=${page}&limit=${limit}`;
  if (resolved !== null) {
    url += `&resolved=${resolved}`;
  }
  return await get(url);
};

// Get a specific incomplete payment
export const getIncompletePayment = async (orderId) => {
  return await get(`/api/admin/incomplete-payment/${orderId}`);
};

// Resolve an incomplete payment
export const resolveIncompletePayment = async (orderId, data) => {
  return await post(`/api/admin/resolve-incomplete-payment/${orderId}`, data);
};