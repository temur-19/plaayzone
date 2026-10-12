import api from "./api.js";

export async function getServiceRating() {
  const { data } = await api.get("/head/api/service-rating/");
  return data;
}

export async function submitServiceRating(score) {
  const { data } = await api.post("/head/api/service-rating/", { score });
  return data;
}
