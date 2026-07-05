import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location, adminMode: true }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/map" replace />;
  }

  return children;
}
