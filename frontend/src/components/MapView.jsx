import { LocateFixed, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categoryMeta } from "../api/locationApi.js";

const DEFAULT_CENTER = [41.3111, 69.2797];

export default function MapView({ apiKey, locations, userPosition, selectedLocation, onSelect, onLocateMe, locationError }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const objectManagerRef = useRef(null);
  const userPlacemarkRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [scriptError, setScriptError] = useState("");

  useEffect(() => { if (!apiKey) return; loadYandexMaps(apiKey).then(() => window.ymaps.ready(() => setReady(true))).catch(() => setScriptError("Yandex xaritasi yuklanmadi. API keyni tekshiring.")); }, [apiKey]);
  useEffect(() => { if (!ready || !mapNode.current || mapRef.current) return; mapRef.current = new window.ymaps.Map(mapNode.current, { center: userPosition ? [userPosition.lat, userPosition.lon] : DEFAULT_CENTER, zoom: userPosition ? 13 : 11, controls: ["zoomControl", "fullscreenControl"] }); objectManagerRef.current = new window.ymaps.ObjectManager({ clusterize: true, gridSize: 48 }); objectManagerRef.current.objects.events.add("click", (event) => { const id = event.get("objectId"); const match = locations.find((item) => String(item.id) === String(id)); if (match) onSelect(match); }); mapRef.current.geoObjects.add(objectManagerRef.current); }, [locations, onSelect, ready, userPosition]);
  useEffect(() => { if (!ready || !objectManagerRef.current) return; objectManagerRef.current.removeAll(); objectManagerRef.current.add({ type: "FeatureCollection", features: locations.map((location) => ({ type: "Feature", id: location.id, geometry: { type: "Point", coordinates: [Number(location.lat), Number(location.lon)] }, properties: { hintContent: location.name }, options: { preset: "islands#circleDotIcon", iconColor: categoryMeta[location.category]?.color || "#facc15" } })) }); }, [locations, ready]);
  useEffect(() => { if (!ready || !mapRef.current) return; if (userPlacemarkRef.current) mapRef.current.geoObjects.remove(userPlacemarkRef.current); if (userPosition) { userPlacemarkRef.current = new window.ymaps.Placemark([userPosition.lat, userPosition.lon], { hintContent: "Mening joylashuvim" }, { preset: "islands#yellowCircleDotIconWithCaption", iconCaption: "Siz" }); mapRef.current.geoObjects.add(userPlacemarkRef.current); } }, [ready, userPosition]);
  useEffect(() => { if (!ready || !mapRef.current || !selectedLocation) return; mapRef.current.setCenter([Number(selectedLocation.lat), Number(selectedLocation.lon)], 15, { duration: 350 }); }, [ready, selectedLocation]);

  return <div className="absolute inset-0 bg-[#020617]"><div className="absolute inset-0 grayscale-[.35] contrast-125" ref={mapNode} />{(!ready || scriptError) && <div className="absolute inset-0 grid place-items-center bg-[#020617]/90 p-6 text-center"><div><Navigation className="mx-auto text-yellow-300" size={44} /><p className="mt-3 text-sm font-black text-slate-300">{scriptError || "Xarita yuklanmoqda..."}</p></div></div>}<button className="btn btn-primary absolute right-4 top-24 z-10 px-4 lg:top-6" onClick={onLocateMe} type="button"><LocateFixed size={16} /><span className="hidden sm:inline">Mening joylashuvim</span></button>{locationError && <div className="absolute bottom-24 left-4 right-4 z-10 rounded-2xl border border-yellow-300/30 bg-[#020617]/85 px-4 py-3 text-sm font-bold text-yellow-100 backdrop-blur-xl lg:bottom-6 lg:right-auto">{locationError}</div>}</div>;
}

function loadYandexMaps(apiKey) {
  if (window.ymaps) return Promise.resolve();
  const existing = document.querySelector("script[data-yandex-maps]");
  if (existing) return new Promise((resolve, reject) => { existing.addEventListener("load", resolve, { once: true }); existing.addEventListener("error", reject, { once: true }); });
  return new Promise((resolve, reject) => { const script = document.createElement("script"); script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=uz_UZ`; script.async = true; script.dataset.yandexMaps = "true"; script.onload = resolve; script.onerror = reject; document.head.appendChild(script); });
}
