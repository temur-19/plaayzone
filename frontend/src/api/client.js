import axios from "axios";
import { clearStoredAuth, loadStoredAuth, saveStoredAuth } from "../utils/storage.js";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const auth = loadStoredAuth();
  if (auth?.access) {
    config.headers.Authorization = `Bearer ${auth.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const auth = loadStoredAuth();

    if (error.response?.status === 401 && auth?.refresh && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: auth.refresh,
        });
        const nextAuth = {
          ...auth,
          access: data.access,
          refresh: data.refresh || auth.refresh,
        };
        saveStoredAuth(nextAuth);
        originalRequest.headers.Authorization = `Bearer ${nextAuth.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearStoredAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
