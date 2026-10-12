import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ServiceRatingPrompt from "./components/ServiceRatingPrompt.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLocationEdit from "./pages/AdminLocationEdit.jsx";
import AdminLocationForm from "./pages/AdminLocationForm.jsx";
import AdminLocations from "./pages/AdminLocations.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import MapPage from "./pages/MapPage.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Routes>
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/management/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/locations" element={<AdminRoute><AdminLocations /></AdminRoute>} />
        <Route path="/admin/locations/new" element={<AdminRoute><AdminLocationForm /></AdminRoute>} />
        <Route path="/admin/locations/:id/edit" element={<AdminRoute><AdminLocationEdit /></AdminRoute>} />
        <Route path="*" element={<PublicShell />} />
      </Routes>
      <ServiceRatingPrompt />
    </div>
  );
}

function PublicShell() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="admin/login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
