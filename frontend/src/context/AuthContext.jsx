import { createContext, useContext, useMemo, useState } from "react";
import { login, logout } from "../api/authApi.js";
import { getStoredAuth } from "../api/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());

  const signIn = async (payload) => {
    const nextAuth = await login(payload, payload.adminMode);
    setAuth(nextAuth);
    return nextAuth;
  };

  const signOut = async () => {
    await logout(auth);
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      auth,
      user: auth?.user || null,
      isAuthenticated: Boolean(auth?.access),
      isAdmin: Boolean(auth?.isAdmin),
      signIn,
      signOut,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
