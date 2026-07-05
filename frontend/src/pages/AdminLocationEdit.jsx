import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminLocations, updateAdminLocation } from "../api/adminApi.js";
import AdminLocationFormComponent from "../components/AdminLocationForm.jsx";
import AdminShell from "../components/AdminShell.jsx";
import Loader from "../components/Loader.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function AdminLocationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getAdminLocations().then((items) => { const found = items.find((item) => String(item.id) === String(id)); if (!found) throw new Error("Lokatsiya topilmadi."); setLocation(found); }).catch((err) => setError(getErrorMessage(err, err.message || "Lokatsiya yuklanmadi."))).finally(() => setLoading(false)); }, [id]);
  const submit = async (payload) => { setSaving(true); setError(""); try { await updateAdminLocation(id, payload); navigate("/admin/locations"); } catch (err) { setError(getErrorMessage(err, "Lokatsiya yangilanmadi.")); } finally { setSaving(false); } };

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#020617] p-6"><Loader label="Lokatsiya yuklanmoqda..." /></div>;
  return <AdminShell title="Lokatsiyani tahrirlash">{error && <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{error}</div>}{location && <AdminLocationFormComponent initialValue={location} loading={saving} onSubmit={submit} />}</AdminShell>;
}
