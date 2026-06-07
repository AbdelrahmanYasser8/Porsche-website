import { apiRequest } from "./client";

export const authApi = {
  login(payload) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  },
  register(payload) {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: payload,
    });
  },
  verifyCode(payload) {
    return apiRequest("/api/auth/verify-code", {
      method: "POST",
      body: payload,
    });
  },
  resendCode(payload) {
    return apiRequest("/api/auth/resend-code", {
      method: "POST",
      body: payload,
    });
  },
  logout() {
    return apiRequest("/api/auth/logout", {
      method: "POST",
    });
  },
  getMe() {
    return apiRequest("/api/auth/me");
  },
  updateProfile(payload) {
    return apiRequest("/api/auth/profile", {
      method: "PUT",
      body: payload,
    });
  },
  changePassword(payload) {
    return apiRequest("/api/auth/password", {
      method: "PUT",
      body: payload,
    });
  },
};
