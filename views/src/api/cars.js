import { apiRequest, buildApiUrl } from "./client";

export const carsApi = {
  list(query = {}) {
    return apiRequest(buildApiUrl("/api/cars", query));
  },
  get(id) {
    return apiRequest(`/api/cars/${id}`);
  },
  create(payload) {
    return apiRequest("/api/cars", {
      method: "POST",
      body: payload,
    });
  },
  async uploadModel(file) {
    return apiRequest("/api/cars/model-assets", {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "X-File-Name": file.name || "model.glb",
      },
      body: file,
    });
  },
  update(id, payload) {
    return apiRequest(`/api/cars/${id}`, {
      method: "PUT",
      body: payload,
    });
  },
  remove(id) {
    return apiRequest(`/api/cars/${id}`, {
      method: "DELETE",
    });
  },
};
