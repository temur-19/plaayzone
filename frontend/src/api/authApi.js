import api, { clearStoredAuth, setStoredAuth } from "./api.js";

export async function login(payload, adminMode = false) {
  const endpoint = adminMode ? "/management/login/" : "/login/";
  const { data } = await api.post(endpoint, {
    username: payload.username,
    password: payload.password,
  });
  const auth = {
    access: data.access || data.token,
    refresh: data.refresh,
    user: data.user || { username: payload.username },
    isAdmin: Boolean(adminMode || data.user?.is_superuser || data.user?.is_staff),
    adminMode,
  };
  setStoredAuth(auth);
  return auth;
}

export async function register(payload) {
  const { data } = await api.post("/signup/", {
    username: payload.username,
    email: payload.email,
    phone: payload.phone,
    password1: payload.password,
    confirm_password: payload.confirmPassword,
  });
  return data;
}

export async function logout(auth) {
  try {
    if (auth?.access) {
      await api.post(auth.adminMode ? "/management/logout/" : "/logout/", auth.adminMode ? {} : { refresh: auth.refresh });
    }
  } finally {
    clearStoredAuth();
  }
}
