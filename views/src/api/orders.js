import { apiRequest } from "./client";

export const ordersApi = {
  listAll() {
    return apiRequest("/api/orders");
  },
  listMine() {
    return apiRequest("/api/orders/mine");
  },
  create(payload) {
    return apiRequest("/api/orders", {
      method: "POST",
      body: payload,
    });
  },
  updateStatus(id, payload) {
    return apiRequest(`/api/orders/${id}/status`, {
      method: "PUT",
      body: payload,
    });
  },
};
