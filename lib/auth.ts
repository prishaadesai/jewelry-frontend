// lib/auth.ts
import api from "./api";

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post("/api/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const { access_token } = response.data;
  localStorage.setItem("token", access_token);

  const userResponse = await api.get("/api/auth/me");
  localStorage.setItem("user", JSON.stringify(userResponse.data));

  return userResponse.data;
};

export const register = async (userData: {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: string;
}) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};
