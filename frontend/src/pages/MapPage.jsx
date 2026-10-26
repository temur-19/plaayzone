import { Gamepad2, LogOut, MapPinPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { distanceInKm, getLocations, getMapConfig } from "../api/locationApi.js";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Loader from "../components/Loader.jsx";
import LocationModal from "../components/LocationModal.jsx";
import MapView from "../components/MapView.jsx";
import MobileBottomNav from "../components/MobileBottomNav.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function MapPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [locations, setLocations] = useState([]);
  const [apiKey, setApiKey] = useState("");
  // Xizmatlar faqat foydalanuvchi kategoriya tanlaganidan keyin ko'rsatiladi.
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modalLocation, setModalLocation] = useState(null);
  const [routeTarget, setRouteTarget] = useState(null);
  const [locateVersion, setLocateVersion] = useState(0);
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

  // GPS holati o'zgarganida ichki marshrut ham qayta hisoblanadi.
  useEffect(() => {
    if (!navigator.geolocation) return undefined;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextPosition = { lat: position.coords.latitude, lon: position.coords.longitude, accuracy: position.coords.accuracy };
        // Bir nuqtada turgandagi GPS xatoligi marshrutni qayta-qayta chizmasin.
        setUserPosition((previousPosition) => (
          shouldUpdatePosition(previousPosition, nextPosition) ? nextPosition : previousPosition
        ));
        setLocationError("");
      },
      () => setLocationError("Jonli joylashuvni aniqlab bo‘lmadi. GPS ruxsatini tekshiring."),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const distances = useMemo(() => Object.fromEntries(locations.map((item) => [item.id, distanceInKm(userPosition, item)])), [locations, userPosition]);
  const visibleLocations = useMemo(() => {
    if (!category) return [];
    const query = search.trim().toLowerCase();
    const filtered = locations.filter((item) => (category === "all" || item.category === category) && (!query || item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)));
    if (!userPosition) return filtered;
    return [...filtered].sort((a, b) => (distances[a.id] ?? Infinity) - (distances[b.id] ?? Infinity));
  }, [category, distances, locations, search, userPosition]);

  const logout = async () => { await signOut(); navigate("/"); };
  const locateMe = async () => {
    const position = await requestLocation();
    if (position) setLocateVersion((version) => version + 1);
  };
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#020617] p-6"><Loader label="PlayZone xaritasi yuklanmoqda..." /></div>;

  return (
    <div className="relative h-dvh overflow-hidden bg-[#020617] text-white">
      <MapView apiKey={apiKey} distances={distances} locateVersion={locateVersion} locationError={locationError} locations={routeTarget ? [] : visibleLocations} onClearRoute={() => setRouteTarget(null)} onDetails={setModalLocation} onLocateMe={locateMe} onSelect={setSelected} routeTarget={routeTarget} selectedLocation={selected} userPosition={userPosition} />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 p-2 sm:p-4 lg:p-6">
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-center gap-1.5 rounded-2xl border border-white/10 bg-[#020617]/90 p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:gap-3 sm:rounded-[1.6rem] sm:p-2">
          <Link className="hidden items-center gap-2 pl-2 pr-3 sm:flex" to="/"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-300 text-slate-950"><Gamepad2 size={20} /></span><span className="font-black">PlayZone</span></Link>
          <SearchBar value={search} onChange={setSearch} />
          <Link aria-label="Joylashuv qo‘shish" className="btn btn-primary hidden px-3 sm:inline-flex sm:px-4" to="/locations/add"><MapPinPlus size={16} /><span>Joy qo‘shish</span></Link>
          <button className="btn btn-secondary hidden px-4 sm:inline-flex" disabled={!userPosition} type="button">Eng yaqin</button>
          <button aria-label="Chiqish" className="btn btn-secondary h-11 w-11 shrink-0 px-0 sm:w-auto sm:px-4" onClick={logout} type="button"><LogOut size={16} /><span className="hidden sm:inline">Chiqish</span></button>
        </div>
      </header>

      {error && <div className="absolute left-4 right-4 top-24 z-30 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 backdrop-blur-xl lg:left-6 lg:right-auto">{error}</div>}

      <div className="map-category-filter absolute bottom-4 left-3 right-3 z-20 rounded-2xl border border-white/45 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:left-1/2 lg:right-auto lg:w-auto lg:-translate-x-1/2"><CategoryFilter compact value={category} onChange={setCategory} /></div>

      <MobileBottomNav />
      <LocationModal distance={modalLocation ? distances[modalLocation.id] : null} location={modalLocation} onClose={() => setModalLocation(null)} onRoute={(location) => { setSelected(location); setRouteTarget(location); setModalLocation(null); }} />
    </div>
  );
}

function shouldUpdatePosition(previous, next) {
  if (!previous) return true;
  const earthRadius = 6371000;
  const toRadians = (value) => (value * Math.PI) / 180;
  const deltaLat = toRadians(next.lat - previous.lat);
  const deltaLon = toRadians(next.lon - previous.lon);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(previous.lat)) * Math.cos(toRadians(next.lat)) * Math.sin(deltaLon / 2) ** 2;
  const movedMeters = earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return movedMeters >= 8 || (next.accuracy ?? Infinity) + 15 < (previous.accuracy ?? Infinity);
}
