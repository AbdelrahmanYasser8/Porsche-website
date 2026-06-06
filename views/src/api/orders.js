import { apiRequest, buildApiUrl } from "./client";

export const ordersApi = {
  listAll(query = {}) {
    return apiRequest(buildApiUrl("/api/orders", query));
  },
  listMine(query = {}) {
    return apiRequest(buildApiUrl("/api/orders/mine", query));
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
