import { apiRequest } from "./client";

export const ordersApi = {
  listAll(query = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "All") {
        searchParams.set(key, value);
      }
    });

    const queryString = searchParams.toString();
    return apiRequest(`/api/orders${queryString ? `?${queryString}` : ""}`);
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
  delete(id) {
    return apiRequest(`/api/orders/${id}`, {
      method: "DELETE",
    });
  },
};
