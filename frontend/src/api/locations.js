import api from "./client.js";

export const categoryOptions = [
  { value: "stadium", label: "Mini-stadion" },
  { value: "playstation", label: "Playstation" },
  { value: "pc_club", label: "Kompyuter klub" },
  { value: "billiard", label: "Billiard" },
];

export async function fetchPublicLocations(category) {
  const { data } = await api.get("/head/api/locations/", {
    params: category ? { category } : {},
  });
  return data;
}

export async function fetchAdminLocations() {
  const { data } = await api.get("/management/api/locations/");
  return data;
}

export async function createLocation(payload) {
  const { data } = await api.post("/api/locations/create/user/", toLocationFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateLocation(id, payload) {
  const { data } = await api.patch(
    `/management/api/locations/${id}/update/`,
    toLocationFormData(payload),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteLocation(id) {
  await api.delete(`/management/api/locations/${id}/delete/`);
}

export async function fetchMyLocations() {
  const { data } = await api.get("/get/my/locations/");
  return data;
}

export async function updateMyLocation(id, payload) {
  const { data } = await api.patch(`/my/locations/${id}/`, toLocationFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteMyLocation(id) {
  await api.delete(`/my/locations/${id}/`);
}

function toLocationFormData(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  return formData;
}
