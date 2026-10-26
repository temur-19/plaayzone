import api from "./api.js";

export async function getAdminDashboard() {
  const { data } = await api.get("/management/admin/");
  return data;
}

export async function getAdminLocations() {
  const { data } = await api.get("/management/api/locations/");
  return data;
}

export async function createAdminLocation(payload) {
  const { data } = await api.post("/management/api/locations/create/", toLocationFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateAdminLocation(id, payload) {
  const { data } = await api.patch(`/management/api/locations/${id}/update/`, toLocationFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteAdminLocation(id) {
  await api.delete(`/management/api/locations/${id}/delete/`);
}

function toLocationFormData(payload) {
  const formData = new FormData();
  ["name", "category", "phone_number", "price", "lat", "lon", "description", "image"].forEach((key) => {
    const value = payload[key];
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
}
