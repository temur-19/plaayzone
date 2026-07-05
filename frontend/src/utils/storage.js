const AUTH_KEY = "onlineitplatform.auth";

export function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function saveStoredAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_KEY);
}
