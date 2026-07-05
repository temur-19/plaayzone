import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminLocation } from "../api/adminApi.js";
import AdminLocationFormComponent from "../components/AdminLocationForm.jsx";
import AdminShell from "../components/AdminShell.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function AdminLocationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (payload) => {
    setLoading(true);
    setError("");
    try { await createAdminLocation(payload); navigate("/admin/locations"); }
    catch (err) { setError(getErrorMessage(err, "Lokatsiya yaratilmadi.")); }
    finally { setLoading(false); }
  };

  return <AdminShell title="Yangi lokatsiya">{error && <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{error}</div>}<AdminLocationFormComponent loading={loading} onSubmit={submit} /></AdminShell>;
}
