import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/client.js";
import { categoryOptions, fetchAdminLocations, fetchPublicLocations } from "../api/locations.js";
import LoadingBlock from "../components/LoadingBlock.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function LocationsList() {
  const [locations, setLocations] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  useEffect(() => {
    setLoading(true);
    setError("");
    const request = isAdmin ? fetchAdminLocations() : fetchPublicLocations(category);
    request
      .then(setLocations)
      .catch((err) => setError(getErrorMessage(err, "Could not load locations.")))
      .finally(() => setLoading(false));
  }, [category, isAdmin]);

  const categoryLabel = useMemo(() => {
    const lookup = Object.fromEntries(categoryOptions.map((item) => [item.value, item.label]));
    return lookup;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-black text-ink">Locations</h1>
          <p className="mt-2 text-slate-600">
            {isAdmin ? "Admin list from `/management/api/locations/`." : "Filtered list from `/head/api/locations/`."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {!isAdmin && (
            <select className="input sm:w-56" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {isAdmin && (
            <Link className="btn btn-primary" to="/locations/add">
              <Plus size={16} />
              Add location
            </Link>
          )}
        </div>
      </div>
      <StatusMessage type="error">{error}</StatusMessage>
      {loading ? (
        <LoadingBlock label="Loading locations..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {locations.map((location) => (
            <article className="panel overflow-hidden" key={location.id}>
              <div className="aspect-[16/9] bg-slate-100">
                {location.image ? (
                  <img className="h-full w-full object-cover" src={absoluteMediaUrl(location.image)} alt={location.name} />
                ) : (
                  <div className="grid h-full place-items-center text-sm font-semibold text-slate-400">No image</div>
                )}
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-coral">{categoryLabel[location.category] || location.category}</p>
                  <h2 className="mt-1 text-xl font-black text-ink">{location.name}</h2>
                </div>
                <p className="line-clamp-3 min-h-12 text-sm leading-6 text-slate-600">{location.description || "No description provided."}</p>
                <dl className="grid grid-cols-2 gap-3 rounded-md bg-slate-50 p-3 text-sm">
                  <div>
                    <dt className="font-semibold text-slate-500">Lat</dt>
                    <dd className="font-bold text-ink">{location.lat}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Lon</dt>
                    <dd className="font-bold text-ink">{location.lon}</dd>
                  </div>
                </dl>
                {isAdmin && (
                  <div className="flex gap-2 pt-2">
                    <Link className="btn btn-secondary flex-1" to={`/locations/${location.id}/edit`}>
                      <Edit3 size={16} />
                      Edit
                    </Link>
                    <Link className="btn btn-danger flex-1" to={`/locations/${location.id}/delete`}>
                      <Trash2 size={16} />
                      Delete
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
          {!locations.length && !error && (
            <div className="panel p-6 text-center text-sm font-semibold text-slate-500 md:col-span-2 xl:col-span-3">No locations found.</div>
          )}
        </div>
      )}
    </div>
  );
}

function absoluteMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}
