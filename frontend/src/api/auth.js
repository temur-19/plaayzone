import api from "./client.js";

export async function loginUser(credentials, adminMode = false) {
  const endpoint = adminMode ? "/management/login/" : "/login/";
  const { data } = await api.post(endpoint, credentials);
  return data;
}

export async function registerUser(payload) {
  const { data } = await api.post("/signup/", payload);
  return data;
}

export async function logoutUser(refresh, adminMode = false) {
  const endpoint = adminMode ? "/management/logout/" : "/logout/";
  const body = adminMode ? {} : { refresh };
  const { data } = await api.post(endpoint, body);
  return data;
}
