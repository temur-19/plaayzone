import { MapPinned, Plus, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard, getAdminLocations } from "../api/adminApi.js";
import { categories } from "../api/locationApi.js";
import AdminShell from "../components/AdminShell.jsx";
import Loader from "../components/Loader.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null); const [locations, setLocations] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { Promise.all([getAdminDashboard(), getAdminLocations()]).then(([stats, items]) => { setDashboard(stats); setLocations(items); }).catch((err) => setError(getErrorMessage(err, "Admin panel yuklanmadi."))).finally(() => setLoading(false)); }, []);
  const counts = useMemo(() => Object.fromEntries(categories.filter((item) => item.value !== "all").map((item) => [item.value, locations.filter((location) => location.category === item.value).length])), [locations]);
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#020617] p-6"><Loader label="Admin panel yuklanmoqda..." /></div>;
  return <AdminShell>{error && <Alert text={error} />}<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Stat icon={MapPinned} label="Jami lokatsiyalar" value={dashboard?.total_locations ?? locations.length} /><Stat icon={UsersRound} label="Foydalanuvchilar" value={dashboard?.total_users ?? 0} /><div className="glass rounded-[2rem] p-5"><p className="text-sm font-black text-slate-400">Yangi lokatsiya</p><Link className="btn btn-primary mt-5" to="/admin/locations/new"><Plus size={16} />Yangi lokatsiya</Link></div></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{categories.filter((item) => item.value !== "all").map((item) => <div className="glass rounded-[2rem] p-5" key={item.value}><p className="text-sm font-black text-slate-400">{item.label === "Mini Stadium" ? "Stadion" : item.label}</p><p className="mt-2 text-4xl font-black text-yellow-300">{counts[item.value] || 0}</p></div>)}</div></AdminShell>;
}
function Stat({ icon: Icon, label, value }) { return <article className="glass rounded-[2rem] p-5"><Icon className="text-yellow-300" size={28} /><p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-2 text-4xl font-black text-white">{value}</p></article>; }
function Alert({ text }) { return <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{text}</div>; }
