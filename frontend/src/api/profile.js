import api from "./client.js";

export async function fetchProfile() {
  const { data } = await api.get("/head/api/profile/");
  return data;
}

export async function updateProfile(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  const { data } = await api.patch("/head/api/profile/update/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
