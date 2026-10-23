import api, { API_BASE_URL } from "./api.js";

export const categories = [
  { value: "all", label: "Hammasi" },
  { value: "playstation", label: "PlayStation" },
  { value: "stadium", label: "Stadion" },
  { value: "billiard", label: "Billiard" },
  { value: "pc_club", label: "PC Club" },
];

export const categoryMeta = {
  playstation: { label: "PlayStation", color: "#7c3aed" },
  stadium: { label: "Stadion", color: "#16a34a" },
  billiard: { label: "Billiard", color: "#dc2626" },
  pc_club: { label: "PC Club", color: "#ea580c" },
};

export async function getLocations(category = "all") {
  const params = category && category !== "all" ? { category } : {};
  const { data } = await api.get("/head/api/locations/", { params });
  return data;
}

export async function getMapConfig() {
  const { data } = await api.get("/head/config/");
  return data;
}

export function getLocationImageUrl(location) {
  if (!location?.image) return "";
  if (location.image.startsWith("http")) return location.image;
  return `${API_BASE_URL}${location.image}`;
}

export function distanceInKm(from, location) {
  if (!from || !location?.lat || !location?.lon) return null;
  const earthRadius = 6371;
  const dLat = toRad(Number(location.lat) - from.lat);
  const dLon = toRad(Number(location.lon) - from.lon);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(Number(location.lat));
  const a = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(value) {
  return (value * Math.PI) / 180;
}
