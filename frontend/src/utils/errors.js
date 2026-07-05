export function getErrorMessage(error, fallback = "Xatolik yuz berdi. Qayta urinib ko‘ring.") {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === "string") return data;
  if (data.error) return data.error;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  const firstValue = data[firstKey];
  if (Array.isArray(firstValue)) return `${firstKey}: ${firstValue.join(", ")}`;
  if (typeof firstValue === "string") return `${firstKey}: ${firstValue}`;
  return fallback;
}
