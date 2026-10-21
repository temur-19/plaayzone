import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMyLocations, updateMyLocation } from "../api/locations.js";
import { getMapConfig } from "../api/locationApi.js";
import Loader from "../components/Loader.jsx";
import LocationForm from "../components/LocationForm.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function MyLocationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchMyLocations(), getMapConfig()]).then(([locations, config]) => {
      const item = locations.find((candidate) => String(candidate.id) === String(id));
      if (!item) throw new Error("Joylashuv topilmadi.");
      setLocation(item); setApiKey(config.api_key || "");
    }).catch((err) => setError(getErrorMessage(err, err.message || "Joylashuvni yuklab bo‘lmadi."))).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaving(true); setError("");
    try { await updateMyLocation(id, payload); navigate("/my-locations"); }
    catch (err) { setError(getErrorMessage(err, "Joylashuvni yangilab bo‘lmadi.")); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader label="Joylashuv yuklanmoqda..." />;
  if (!location) return <StatusMessage type="error">{error || "Joylashuv topilmadi."}</StatusMessage>;
  return <div className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-3xl font-black text-white">Xizmatni tahrirlash</h1><p className="mt-2 text-slate-400">Ma’lumotlarni o‘zgartirib saqlang.</p></div><StatusMessage type="error">{error}</StatusMessage><LocationForm apiKey={apiKey} initialValues={location} submitLabel="O‘zgarishlarni saqlash" submitting={saving} onSubmit={handleSubmit} /></div>;
}
