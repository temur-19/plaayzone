import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdminLocation, getAdminLocations } from "../api/adminApi.js";
import { categories, categoryMeta, getLocationImageUrl } from "../api/locationApi.js";
import AdminShell from "../components/AdminShell.jsx";
import Loader from "../components/Loader.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getAdminLocations()
      .then(setLocations)
      .catch((err) => setError(getErrorMessage(err, "Lokatsiyalar yuklanmadi.")))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => locations.filter((item) => (category === "all" || item.category === category)
      && item.name?.toLowerCase().includes(query.toLowerCase())),
    [category, locations, query],
  );

  const remove = async (location) => {
    if (!confirm(`${location.name} o‘chirilsinmi?`)) return;
    setDeletingId(location.id);
    setError("");
    try {
      await deleteAdminLocation(location.id);
      setLocations((items) => items.filter((item) => item.id !== location.id));
    } catch (err) {
      setError(getErrorMessage(err, "Lokatsiyani o‘chirib bo‘lmadi."));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#020617] p-6"><Loader label="Lokatsiyalar yuklanmoqda..." /></div>;

  return (
    <AdminShell>
      {error && <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200" role="alert">{error}</div>}
      <div className="glass mb-5 rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px_auto]">
          <label className="relative min-w-0">
            <span className="sr-only">Nomi bo‘yicha qidirish</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" size={18} />
            <input className="input pl-11" placeholder="Nomi bo‘yicha qidirish" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select aria-label="Kategoriya" className="input" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option className="bg-[#020617]" key={item.value} value={item.value}>{item.value === "all" ? "Barcha kategoriyalar" : item.label === "Mini Stadium" ? "Stadion" : item.label}</option>)}
          </select>
          <Link className="btn btn-primary w-full lg:w-auto" to="/admin/locations/new"><Plus size={16} />Yangi lokatsiya</Link>
        </div>
      </div>

      <div className="grid gap-3 sm:hidden">
        {filtered.map((location) => <LocationCard key={location.id} location={location} deleting={deletingId === location.id} onDelete={remove} />)}
        {!filtered.length && <p className="glass rounded-2xl p-5 text-center text-sm font-bold text-slate-400">Lokatsiya topilmadi.</p>}
      </div>

      <div className="glass hidden overflow-hidden rounded-[2rem] sm:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm">
            <thead className="bg-white/[0.03]"><tr>{["ID", "Rasm", "Kategoriya", "Nomi", "Telefon", "Narx", "Koordinatalar", "Amallar"].map((head) => <th className="whitespace-nowrap px-4 py-4 text-left font-black text-slate-400" key={head}>{head}</th>)}</tr></thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((location) => <LocationRow key={location.id} location={location} deleting={deletingId === location.id} onDelete={remove} />)}
              {!filtered.length && <tr><td className="px-4 py-8 text-center font-bold text-slate-400" colSpan={8}>Lokatsiya topilmadi.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function CategoryBadge({ category }) {
  const meta = categoryMeta[category] || { label: category, color: "#facc15" };
  return <span className="inline-flex rounded-full px-3 py-1 text-xs font-black text-slate-950" style={{ backgroundColor: meta.color }}>{meta.label}</span>;
}

function LocationCard({ location, deleting, onDelete }) {
  const image = getLocationImageUrl(location);
  return (
    <article className="glass min-w-0 rounded-2xl p-3">
      <div className="flex min-w-0 gap-3">
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#020617]">
          {image && <img className="h-full w-full object-cover" src={image} alt={location.name} />}
        </div>
        <div className="min-w-0 flex-1">
          <CategoryBadge category={location.category} />
          <h2 className="mt-2 break-words text-base font-black text-white">{location.name}</h2>
          <p className="mt-1 text-sm text-slate-400">#{location.id}</p>
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/10 pt-3 text-sm">
        <Info label="Telefon" value={location.phone_number ? `+998 ${location.phone_number}` : "-"} />
        <Info label="Narx" value={location.price ? `${Number(location.price).toLocaleString("uz-UZ")} so‘m` : "-"} />
        <Info label="Kenglik" value={location.lat} />
        <Info label="Uzunlik" value={location.lon} />
      </dl>
      <div className="mt-3 flex gap-2">
        <Link aria-label={`${location.name}ni tahrirlash`} className="btn btn-primary min-w-0 flex-1 px-2 text-xs" to={`/admin/locations/${location.id}/edit`}><Edit3 size={15} />Tahrirlash</Link>
        <button aria-label={`${location.name}ni o‘chirish`} className="btn btn-danger min-w-0 flex-1 px-2 text-xs" disabled={deleting} onClick={() => onDelete(location)} type="button"><Trash2 size={15} />{deleting ? "O‘chirilmoqda" : "O‘chirish"}</button>
      </div>
    </article>
  );
}

function LocationRow({ location, deleting, onDelete }) {
  const image = getLocationImageUrl(location);
  return (
    <tr className="hover:bg-white/[0.03]">
      <td className="whitespace-nowrap px-4 py-4 font-black text-yellow-300">#{location.id}</td>
      <td className="px-4 py-4"><div className="h-14 w-20 overflow-hidden rounded-xl bg-[#020617]">{image && <img className="h-full w-full object-cover" src={image} alt={location.name} />}</div></td>
      <td className="px-4 py-4"><CategoryBadge category={location.category} /></td>
      <td className="whitespace-nowrap px-4 py-4 font-black text-white">{location.name}</td>
      <td className="whitespace-nowrap px-4 py-4 text-slate-400">{location.phone_number ? `+998 ${location.phone_number}` : "-"}</td>
      <td className="whitespace-nowrap px-4 py-4 text-slate-400">{location.price ? `${Number(location.price).toLocaleString("uz-UZ")} so‘m` : "-"}</td>
      <td className="whitespace-nowrap px-4 py-4 text-slate-400">{location.lat}, {location.lon}</td>
      <td className="px-4 py-4"><div className="flex gap-2"><Link aria-label={`${location.name}ni tahrirlash`} className="btn btn-primary min-h-9 whitespace-nowrap px-3 py-1" to={`/admin/locations/${location.id}/edit`}><Edit3 size={15} />Tahrirlash</Link><button aria-label={`${location.name}ni o‘chirish`} className="btn btn-danger min-h-9 whitespace-nowrap px-3 py-1" disabled={deleting} onClick={() => onDelete(location)} type="button"><Trash2 size={15} />O‘chirish</button></div></td>
    </tr>
  );
}

function Info({ label, value }) {
  return <div className="min-w-0"><dt className="text-xs font-bold text-slate-500">{label}</dt><dd className="break-words font-semibold text-slate-300">{value}</dd></div>;
}
