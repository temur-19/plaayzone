import api from "./client.js";

export async function fetchDashboard() {
  const { data } = await api.get("/management/admin/");
  return data;
}
