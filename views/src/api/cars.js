import { apiRequest } from "./client";

export const carsApi = {
  list(query = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "All") {
        searchParams.set(key, value);
      }
    });

    const queryString = searchParams.toString();
    return apiRequest(`/api/cars${queryString ? `?${queryString}` : ""}`);
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
  seed() {
    return apiRequest("/api/cars/seed", {
      method: "GET",
    });
  },
};
