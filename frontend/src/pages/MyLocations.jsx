import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryOptions, deleteMyLocation, fetchMyLocations } from "../api/locations.js";
import LoadingBlock from "../components/LoadingBlock.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { getErrorMessage } from "../utils/errors.js";

const categoryLabel = (category) => categoryOptions.find((item) => item.value === category)?.label || category;

export default function MyLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyLocations()
      .then(setLocations)
      .catch((err) => setError(getErrorMessage(err, "Xizmatlaringizni yuklab bo‘lmadi.")))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (location) => {
    if (!window.confirm(`“${location.name}” joylashuvini o‘chirasizmi?`)) return;
    setDeletingId(location.id);
    setError("");
    try {
      await deleteMyLocation(location.id);
      setLocations((items) => items.filter((item) => item.id !== location.id));
    } catch (err) {
      setError(getErrorMessage(err, "Joylashuvni o‘chirib bo‘lmadi."));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingBlock label="Xizmatlaringiz yuklanmoqda..." />;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><span className="yellow-pill">Shaxsiy kabinet</span><h1 className="mt-4 text-3xl font-black text-white">Mening xizmatlarim</h1><p className="mt-2 text-slate-400">Siz qo‘shgan joylashuvlarni tahrirlang yoki o‘chiring.</p></div>
        <Link className="btn btn-primary" to="/locations/add"><Plus size={16} />Joy qo‘shish</Link>
      </div>
      <StatusMessage type="error">{error}</StatusMessage>
      {locations.length === 0 ? (
        <div className="panel p-8 text-center"><MapPin className="mx-auto text-yellow-300" size={38} /><h2 className="mt-4 text-xl font-black text-white">Hali joylashuv qo‘shmagansiz</h2><p className="mt-2 text-slate-400">Birinchi xizmatingizni qo‘shib, xaritada ko‘rsating.</p></div>
      ) : <div className="grid gap-4 md:grid-cols-2">{locations.map((location) => (
        <article key={location.id} className="panel p-5">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-yellow-300">{categoryLabel(location.category)}</p><h2 className="mt-2 text-xl font-black text-white">{location.name}</h2></div><MapPin className="shrink-0 text-slate-400" size={20} /></div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{location.description || "Tavsif kiritilmagan."}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-slate-300"><span>+998 {location.phone_number}</span><span>{location.price} so‘m</span></div>
          <div className="mt-5 flex gap-3 border-t border-white/10 pt-4"><Link className="btn btn-secondary flex-1" to={`/my-locations/${location.id}/edit`}><Pencil size={16} />Tahrirlash</Link><button className="btn btn-danger flex-1" disabled={deletingId === location.id} onClick={() => handleDelete(location)} type="button"><Trash2 size={16} />{deletingId === location.id ? "O‘chirilmoqda..." : "O‘chirish"}</button></div>
        </article>
      ))}</div>}
    </div>
  );
}
