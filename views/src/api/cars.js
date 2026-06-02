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
    return apiRequest(`/api/cars${queryString ? `?${queryString}` : ""}`, {
      cache: "no-store",
    });
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
    const response = await fetch("/api/cars/model-assets", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "X-File-Name": file.name || "model.glb",
      },
      body: file,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        data && typeof data === "object" && "error" in data
          ? data.error
          : typeof data === "string" && data.trim()
            ? data
            : "Model upload failed";

      throw new Error(message);
    }

    return data;
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
