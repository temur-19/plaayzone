import axios from "axios";

const AUTH_KEY = "playzone.auth";
let refreshPromise = null;

const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.split("->", 1)[0].trim().replace(/\/+$/, "");
export const API_BASE_URL = configuredApiUrl ?? "";

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function setStoredAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_KEY);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const auth = getStoredAuth();
  if (auth?.access) {
    config.headers.Authorization = `Bearer ${auth.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const auth = getStoredAuth();

    if (error.response?.status === 401 && auth?.refresh && !original?._retry && !original?.url?.includes("/token/refresh/")) {
      original._retry = true;
      try {
        refreshPromise ??= axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: auth.refresh,
        }).finally(() => { refreshPromise = null; });
        const { data } = await refreshPromise;
        const nextAuth = { ...auth, access: data.access, refresh: data.refresh || auth.refresh };
        setStoredAuth(nextAuth);
        original.headers.Authorization = `Bearer ${nextAuth.access}`;
        return api(original);
      } catch (refreshError) {
        clearStoredAuth();
        window.dispatchEvent(new Event("auth:expired"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
