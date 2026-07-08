import { Filter, Gamepad2, LogOut, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { distanceInKm, getLocations, getMapConfig } from "../api/locationApi.js";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Loader from "../components/Loader.jsx";
import LocationModal from "../components/LocationModal.jsx";
import MapView from "../components/MapView.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function MapPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [locations, setLocations] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modalLocation, setModalLocation] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  const requestLocation = () => new Promise((resolve) => {
    if (!navigator.geolocation) {
      setLocationError("Brauzeringiz GPS joylashuvni qo‘llab-quvvatlamaydi.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lon: position.coords.longitude, accuracy: position.coords.accuracy };
        setUserPosition(coords);
        setLocationError("");
        resolve(coords);
      },
      (err) => {
        const message = err.code === err.PERMISSION_DENIED
          ? "Joylashuvga ruxsat berilmadi. Ruxsat bersangiz xarita siz turgan joyga markazlanadi."
          : "Joylashuvni aniqlab bo‘lmadi. Birozdan keyin qayta urinib ko‘ring.";
        setLocationError(message);
        resolve(null);
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 12000 },
    );
  });

  useEffect(() => {
    requestLocation()
      .then(() => Promise.all([getMapConfig(), getLocations()]))
      .then(([config, items]) => { setApiKey(config.api_key || ""); setLocations(items); })
      .catch((err) => setError(getErrorMessage(err, "Xarita ma’lumotlari yuklanmadi.")))
      .finally(() => setLoading(false));
  }, []);

  const distances = useMemo(() => Object.fromEntries(locations.map((item) => [item.id, distanceInKm(userPosition, item)])), [locations, userPosition]);
  const visibleLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = locations.filter((item) => (category === "all" || item.category === category) && (!query || item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)));
    if (!userPosition) return filtered;
    return [...filtered].sort((a, b) => (distances[a.id] ?? Infinity) - (distances[b.id] ?? Infinity));
  }, [category, distances, locations, search, userPosition]);

  const logout = async () => { await signOut(); navigate("/"); };
  const selectFromSidebar = (location) => { setSelected(location); setModalLocation(location); };

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#020617] p-6"><Loader label="PlayZone xaritasi yuklanmoqda..." /></div>;

  return (
    <div className="relative h-screen overflow-hidden bg-[#020617] text-white">
      <MapView apiKey={apiKey} distances={distances} locationError={locationError} locations={visibleLocations} onDetails={setModalLocation} onLocateMe={requestLocation} onSelect={setSelected} selectedLocation={selected} userPosition={userPosition} />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 p-4 lg:p-6">
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-center gap-3 rounded-[1.6rem] border border-white/10 bg-[#020617]/80 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <Link className="hidden items-center gap-2 pl-2 pr-3 sm:flex" to="/"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-300 text-slate-950"><Gamepad2 size={20} /></span><span className="font-black">PlayZone</span></Link>
          <SearchBar value={search} onChange={setSearch} />
          <button className="btn btn-primary hidden px-4 sm:inline-flex"><Search size={16} />Qidirish</button>
          <button className="btn btn-secondary px-4" onClick={() => setPanelOpen((value) => !value)} type="button"><Filter size={16} /><span className="hidden sm:inline">Filter</span></button>
          <button className="btn btn-secondary hidden px-4 sm:inline-flex" disabled={!userPosition} type="button">Eng yaqin</button>
          <button className="btn btn-secondary px-4" onClick={logout} type="button"><LogOut size={16} /></button>
        </div>
      </header>

      {error && <div className="absolute left-4 right-4 top-24 z-30 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 backdrop-blur-xl lg:left-6 lg:right-auto">{error}</div>}

      {panelOpen && <div className="absolute bottom-28 left-4 right-4 z-20 lg:bottom-auto lg:left-6 lg:right-auto lg:top-28"><Sidebar distances={distances} locations={visibleLocations} onSelect={selectFromSidebar} selectedId={selected?.id} /></div>}

      <div className="absolute bottom-4 left-3 right-3 z-20 rounded-2xl border border-white/45 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:left-1/2 lg:right-auto lg:w-auto lg:-translate-x-1/2"><CategoryFilter compact value={category} onChange={setCategory} /></div>

      <LocationModal distance={modalLocation ? distances[modalLocation.id] : null} location={modalLocation} onClose={() => setModalLocation(null)} />
    </div>
  );
}
