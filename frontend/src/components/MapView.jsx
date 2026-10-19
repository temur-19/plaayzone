import { LocateFixed, Navigation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categoryMeta, getLocationImageUrl } from "../api/locationApi.js";
import { loadYandexMaps } from "../utils/yandexMaps.js";

const DEFAULT_CENTER = [41.3111, 69.2797];
const CATEGORY_COLORS = {
  stadium: "#16a34a",
  playstation: "#7c3aed",
  pc_club: "#ea580c",
  billiard: "#dc2626",
};
const ICON_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/static/images/map-icons`;
const PLACE_ICON_SIZE = [45, 45];
const PLACE_ICON_OFFSET = [-22, -45];
const PLACE_ICON_HOVER_SIZE = [52, 52];
const PLACE_ICON_HOVER_OFFSET = [-26, -52];
const MAX_ACCURACY_RADIUS = 220;
const NEARBY_FIT_LIMIT = 12;

export default function MapView({ apiKey, locations, userPosition, selectedLocation, onSelect, onDetails, onLocateMe, locationError, distances = {} }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const locationCollectionRef = useRef(null);
  const locationMarkersRef = useRef([]);
  const markerLayoutsRef = useRef(null);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const fittedKeyRef = useRef("");
  const [ready, setReady] = useState(false);
  const [scriptError, setScriptError] = useState("");

  useEffect(() => {
    if (!apiKey) return;
    loadYandexMaps(apiKey)
      .then(() => window.ymaps.ready(() => setReady(true)))
      .catch(() => setScriptError("Yandex xaritasi yuklanmadi. API keyni tekshiring."));
  }, [apiKey]);

  useEffect(() => {
    if (!ready || !mapNode.current || mapRef.current) return;

    mapRef.current = new window.ymaps.Map(mapNode.current, {
      center: DEFAULT_CENTER,
      zoom: 12,
      controls: ["zoomControl", "fullscreenControl"],
    });
    markerLayoutsRef.current = createMarkerLayouts();
    locationCollectionRef.current = new window.ymaps.GeoObjectCollection();
    mapRef.current.geoObjects.add(locationCollectionRef.current);
  }, [ready]);

  useEffect(() => {
    if (!ready || !locationCollectionRef.current) return;

    locationCollectionRef.current.removeAll();
    locationMarkersRef.current = [];

    const seen = new Set();
    locations.forEach((location) => {
      const lat = Number(location.lat);
      const lon = Number(location.lon);
      const markerId = String(location.id);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || seen.has(markerId)) return;
      seen.add(markerId);

      const selected = String(selectedLocation?.id) === markerId;
      const iconSize = selected ? PLACE_ICON_HOVER_SIZE : PLACE_ICON_SIZE;
      const iconOffset = selected ? PLACE_ICON_HOVER_OFFSET : PLACE_ICON_OFFSET;
      const marker = new window.ymaps.Placemark(
        [lat, lon],
        {
          hintContent: location.name,
          balloonContent: makeLocationBalloon(location, distances[location.id]),
        },
        {
          iconLayout: "default#image",
          iconImageHref: getIconByCategory(location.category),
          iconImageSize: iconSize,
          iconImageOffset: iconOffset,
          iconShape: { type: "Rectangle", coordinates: [[iconOffset[0], iconOffset[1]], [iconOffset[0] + iconSize[0], iconOffset[1] + iconSize[1]]] },
          zIndex: selected ? 760 : 520,
          balloonOffset: [0, 22],
          balloonPanelMaxMapArea: 0,
        },
      );

      marker.events.add("click", () => onSelect(location));
      marker.events.add("mouseenter", () => marker.options.set({ iconImageSize: PLACE_ICON_HOVER_SIZE, iconImageOffset: PLACE_ICON_HOVER_OFFSET, zIndex: 780 }));
      marker.events.add("mouseleave", () => {
        if (String(selectedLocation?.id) === markerId) return;
        marker.options.set({ iconImageSize: PLACE_ICON_SIZE, iconImageOffset: PLACE_ICON_OFFSET, zIndex: 520 });
      });
      locationMarkersRef.current.push({ id: markerId, marker });
      locationCollectionRef.current.add(marker);
    });
  }, [distances, locations, onSelect, ready, selectedLocation]);

  useEffect(() => {
    if (!ready || !onDetails) return;
    const handleDetails = (event) => {
      const match = locations.find((location) => String(location.id) === String(event.detail?.id));
      if (match) onDetails(match);
    };
    document.addEventListener("playzone:location-details", handleDetails);
    return () => document.removeEventListener("playzone:location-details", handleDetails);
  }, [locations, onDetails, ready]);

  useEffect(() => {
    if (!ready || !mapRef.current || !markerLayoutsRef.current) return;

    if (userMarkerRef.current) mapRef.current.geoObjects.remove(userMarkerRef.current);
    if (accuracyCircleRef.current) mapRef.current.geoObjects.remove(accuracyCircleRef.current);
    userMarkerRef.current = null;
    accuracyCircleRef.current = null;

    if (!userPosition) return;

    const coords = [userPosition.lat, userPosition.lon];
    if (Number.isFinite(userPosition.accuracy) && userPosition.accuracy > 0) {
      const accuracyRadius = Math.min(Math.max(userPosition.accuracy, 25), MAX_ACCURACY_RADIUS);
      accuracyCircleRef.current = new window.ymaps.Circle([coords, accuracyRadius], {}, {
        fillColor: "#0ea5e914",
        strokeColor: "#0284c7",
        strokeOpacity: 0.22,
        strokeWidth: 1,
      });
      mapRef.current.geoObjects.add(accuracyCircleRef.current);
    }

    userMarkerRef.current = new window.ymaps.Placemark(coords, { hintContent: "Mening joylashuvim" }, {
      iconLayout: markerLayoutsRef.current.user,
      iconShape: { type: "Circle", coordinates: [0, 0], radius: 28 },
      zIndex: 900,
    });
    mapRef.current.geoObjects.add(userMarkerRef.current);
    mapRef.current.setCenter(coords, 15, { duration: 450 });
  }, [ready, userPosition]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const validPlaces = locations
      .map((location) => [Number(location.lat), Number(location.lon)])
      .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon));
    const nearbyPlaces = userPosition ? validPlaces.slice(0, NEARBY_FIT_LIMIT) : validPlaces;
    const points = userPosition ? [[userPosition.lat, userPosition.lon], ...nearbyPlaces] : nearbyPlaces;
    const key = points.map(([lat, lon]) => `${lat.toFixed(5)},${lon.toFixed(5)}`).join("|");
    if (!points.length || fittedKeyRef.current === key || selectedLocation) return;
    fittedKeyRef.current = key;

    if (points.length === 1) {
      mapRef.current.setCenter(points[0], userPosition ? 15 : 12, { duration: 450 });
      return;
    }

    mapRef.current.setBounds(window.ymaps.util.bounds.fromPoints(points), {
      checkZoomRange: true,
      duration: 450,
      zoomMargin: [96, 80, 140, 80],
    }).then(() => {
      if (mapRef.current.getZoom() > 15) mapRef.current.setZoom(15, { duration: 250 });
      if (!userPosition && mapRef.current.getZoom() > 12) mapRef.current.setZoom(12, { duration: 250 });
    });
  }, [locations, ready, selectedLocation, userPosition]);

  useEffect(() => {
    if (!ready || !mapRef.current || !selectedLocation) return;

    const coords = [Number(selectedLocation.lat), Number(selectedLocation.lon)];
    if (!Number.isFinite(coords[0]) || !Number.isFinite(coords[1])) return;
    mapRef.current.setCenter(coords, 15, { duration: 350 });
    const item = locationMarkersRef.current.find((entry) => String(entry.id) === String(selectedLocation.id));
    item?.marker.balloon.open();
  }, [ready, selectedLocation]);

  return <div className="absolute inset-0 bg-[#0f172a]"><div className="pz-dark-map absolute inset-0" ref={mapNode} /><div className="pointer-events-none absolute inset-0 z-[1] bg-[#0f2742]/14" />{(!ready || scriptError) && <div className="absolute inset-0 z-20 grid place-items-center bg-[#020617]/90 p-6 text-center"><div><Navigation className="mx-auto text-yellow-300" size={44} /><p className="mt-3 text-sm font-black text-slate-300">{scriptError || "Xarita yuklanmoqda..."}</p></div></div>}<button className="btn btn-primary absolute right-4 top-24 z-10 px-4 lg:top-6" onClick={onLocateMe} type="button"><LocateFixed size={16} /><span className="hidden sm:inline">Mening joylashuvim</span></button>{locationError && <div className="absolute bottom-24 left-4 right-4 z-10 rounded-2xl border border-yellow-300/30 bg-[#020617]/85 px-4 py-3 text-sm font-bold text-yellow-100 backdrop-blur-xl lg:bottom-6 lg:right-auto">{locationError}</div>}</div>;
}

function createMarkerLayouts() {
  return {
    user: window.ymaps.templateLayoutFactory.createClass(`
      <div class="pz-user-dot" style="position:relative;width:28px;height:28px;transform:translate(-14px,-14px);">
        <div style="position:absolute;inset:0;border-radius:999px;background:rgba(14,165,233,.14);"></div>
        <div style="position:absolute;left:5px;top:5px;width:18px;height:18px;border-radius:999px;background:#0ea5e9;border:4px solid #fff;box-shadow:0 8px 18px rgba(15,23,42,.24);"></div>
      </div>
    `),
  };
}

function makeLocationBalloon(location, distance) {
  const meta = categoryMeta[location.category] || { label: location.category || "Kategoriya" };
  const price = location.price ? `${Number(location.price).toLocaleString("uz-UZ")} so‘m` : "Kiritilmagan";
  const phone = location.phone_number ? `+998 ${location.phone_number}` : "Kiritilmagan";
  const callUrl = location.phone_number ? `tel:+998${location.phone_number}` : "#";
  const distanceText = distance == null ? "Masofa mavjud emas" : `${distance.toFixed(1)} km uzoqlikda`;
  const image = getLocationImageUrl(location);

  return `
    <div style="width:254px;padding:10px 10px 11px;font-family:Inter,Arial,sans-serif;color:#0f172a;background:#fff;">
      ${image ? `<img src="${escapeHtml(image)}" alt="" style="width:100%;height:86px;object-fit:contain;object-position:center;border-radius:11px;margin-bottom:8px;background:#f1f5f9;"/>` : ""}
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
        <div>
          <div style="font-size:16px;font-weight:900;line-height:1.15;margin-bottom:5px">${escapeHtml(location.name || "Nomsiz joy")}</div>
          <span style="display:inline-flex;align-items:center;border-radius:999px;background:${CATEGORY_COLORS[location.category] || "#2563eb"}1a;color:${CATEGORY_COLORS[location.category] || "#2563eb"};padding:3px 8px;font-size:11px;font-weight:900">${escapeHtml(meta.label)}</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px;">
        ${cardStat("Masofa", distanceText)}
        ${cardStat("Narx", price)}
      </div>
      <div style="margin-top:7px;color:#475569;font-size:12px;line-height:1.35;max-height:32px;overflow:hidden;">${escapeHtml(location.description || "Tavsif kiritilmagan.")}</div>
      <div style="display:flex;gap:7px;margin-top:9px;">
        <a href="${callUrl}" style="flex:1;text-align:center;text-decoration:none;border-radius:11px;background:#0f172a;color:#fff;padding:8px 9px;font-size:12px;font-weight:900;${location.phone_number ? "" : "pointer-events:none;opacity:.45"}">Qo‘ng‘iroq</a>
        <button type="button" onclick="document.dispatchEvent(new CustomEvent('playzone:location-details',{detail:{id:'${escapeHtml(String(location.id))}'}}))" style="flex:1;border:0;border-radius:11px;background:#f1f5f9;color:#0f172a;padding:8px 9px;font-size:12px;font-weight:900;cursor:pointer;">Batafsil</button>
      </div>
      <div style="margin-top:7px;color:#64748b;font-size:11px;font-weight:700;">${escapeHtml(phone)}</div>
    </div>
  `;
}

function cardStat(label, value) {
  return `<div style="border-radius:10px;background:#f8fafc;padding:7px 8px;"><span style="display:block;color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em">${label}</span><strong style="display:block;margin-top:2px;color:#0f172a;font-size:12px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(String(value))}</strong></div>`;
}

function getIconByCategory(category) {
  const icons = {
    playstation: `${ICON_BASE_URL}/playstation.png`,
    stadium: `${ICON_BASE_URL}/stadium.png`,
    pc_club: `${ICON_BASE_URL}/pc-club.png`,
    billiard: `${ICON_BASE_URL}/billiard.png`,
  };
  return icons[category] || `${ICON_BASE_URL}/playstation.png`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
