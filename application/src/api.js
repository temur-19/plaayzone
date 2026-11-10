import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL_KEY = "playzone.apiUrl";
const DEFAULT_API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "")
  .trim()
  .replace(/\/+$/, "");
let apiBaseUrl = DEFAULT_API_URL;

export function normalizeApiUrl(value) {
  const url = value.trim().replace(/\/+$/, "");
  if (!url) throw new Error("Backend manzilini kiriting.");

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Manzil noto‘g‘ri. Masalan: https://example.trycloudflare.com");
  }

  if (
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    !parsedUrl.hostname ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.search ||
    parsedUrl.hash
  ) {
    throw new Error("Faqat to‘g‘ri HTTP yoki HTTPS server manzilini kiriting.");
  }

  return url;
}

export async function loadApiUrl() {
  const savedUrl = await AsyncStorage.getItem(API_URL_KEY);
  apiBaseUrl = savedUrl ? normalizeApiUrl(savedUrl) : DEFAULT_API_URL;
  return apiBaseUrl;
}

export async function saveApiUrl(value) {
  const normalizedUrl = normalizeApiUrl(value);
  await AsyncStorage.setItem(API_URL_KEY, normalizedUrl);
  apiBaseUrl = normalizedUrl;
  return normalizedUrl;
}

async function request(path, options = {}) {
  if (!apiBaseUrl) {
    throw new Error("Backend manzilini sozlamalardan kiriting.");
  }

  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Backendga ulanib bo‘lmadi. Server manzili va tarmoq ulanishini tekshiring.",
    );
  }

  const responseText = await response.text();
  let data = null;
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Backenddan noto‘g‘ri javob keldi.");
    }
  }

  if (!response.ok) {
    const message =
      data?.error ??
      data?.detail ??
      Object.values(data ?? {}).flat().find((value) => typeof value === "string");
    throw new Error(message || `Server xatosi (${response.status}).`);
  }

  return data;
}

export function getLocations(category = "") {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return request(`/head/api/locations/${query}`).then((data) => {
    if (!Array.isArray(data)) {
      throw new Error("Backenddan maskanlar ro‘yxati noto‘g‘ri formatda keldi.");
    }
    return data;
  });
}

export function login(username, password) {
  return request("/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}
