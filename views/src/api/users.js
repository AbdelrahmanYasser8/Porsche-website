import { apiRequest, buildApiUrl } from "./client";

export const usersApi = {
  list(query = {}) {
    return apiRequest(buildApiUrl("/api/users", query));
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
