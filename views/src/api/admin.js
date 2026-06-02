import { apiRequest } from "./client";

export const adminApi = {
  getDashboardSummary() {
    return apiRequest("/api/admin/dashboard");
  },
};
