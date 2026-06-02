import { apiRequest } from "./client";

export const usersApi = {
  list(query = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "All") {
        searchParams.set(key, value);
      }
    });

    const queryString = searchParams.toString();
    return apiRequest(`/api/users${queryString ? `?${queryString}` : ""}`);
  },
  get(id) {
    return apiRequest(`/api/users/${id}`);
  },
  updateStatus(id, payload) {
    return apiRequest(`/api/users/${id}/status`, {
      method: "PUT",
      body: payload,
    });
  },
  updateRole(id, payload) {
    return apiRequest(`/api/users/${id}/role`, {
      method: "PUT",
      body: payload,
    });
  },
  remove(id) {
    return apiRequest(`/api/users/${id}`, {
      method: "DELETE",
    });
  },
};
