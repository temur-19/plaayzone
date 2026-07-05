import { MapPinned, Plus, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboard } from "../api/dashboard.js";
import LoadingBlock from "../components/LoadingBlock.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err, "Could not load dashboard.")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingBlock label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-ink">Admin dashboard</h1>
          <p className="mt-2 text-slate-600">Overview from `/management/admin/`.</p>
        </div>
        <Link className="btn btn-primary" to="/locations/add">
          <Plus size={16} />
          Add location
        </Link>
      </div>
      <StatusMessage type="error">{error}</StatusMessage>
      {stats && (
        <>
          <section className="grid gap-4 md:grid-cols-2">
            <StatCard icon={MapPinned} label="Locations" value={stats.total_locations} />
            <StatCard icon={UsersRound} label="Users" value={stats.total_users} />
          </section>
          <section className="panel p-5">
            <h2 className="text-xl font-black text-ink">Locations by category</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {stats.locations_by_category?.map((item) => (
                <div key={item.category} className="rounded-md border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-500">{item.category}</p>
                  <p className="mt-2 text-3xl font-black text-ocean">{item.count}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <article className="panel p-5">
      <Icon className="text-coral" size={28} />
      <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black text-ink">{value ?? 0}</p>
    </article>
  );
}
