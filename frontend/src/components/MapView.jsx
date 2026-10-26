import { LocateFixed, Navigation, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../api/api.js";
import { loadYandexMaps } from "../utils/yandexMaps.js";

const DEFAULT_CENTER = [41.3111, 69.2797];
const ICON_BASE_URL = `${API_BASE_URL}/static/images/map-icons`;
const MAX_ACCURACY_RADIUS = 220;
const NEARBY_FIT_LIMIT = 12;

export default function MapView({ apiKey, locations, userPosition, selectedLocation, routeTarget, locateVersion, onClearRoute, onSelect, onDetails, onLocateMe, locationError, distances = {} }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const locationCollectionRef = useRef(null);
  const locationMarkersRef = useRef([]);
  const markerLayoutsRef = useRef(null);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const routeRef = useRef(null);
  const routeDestinationIdRef = useRef(null);
  const processedLocateVersionRef = useRef(0);
  const hasCenteredOnUserRef = useRef(false);
  const fittedKeyRef = useRef("");
  const selectedMarkerIdRef = useRef(null);
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

  useEffect(() => () => {
    mapRef.current?.destroy();
    mapRef.current = null;
    locationCollectionRef.current = null;
    locationMarkersRef.current = [];
    markerLayoutsRef.current = null;
    userMarkerRef.current = null;
    accuracyCircleRef.current = null;
    routeRef.current = null;
  }, []);

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

      const layouts = markerLayoutsRef.current.locations[location.category]
        || markerLayoutsRef.current.locations.playstation;
      const pin = layouts.normal;
      const priceLabel = formatPrice(location.price);
      const marker = new window.ymaps.Placemark(
        [lat, lon],
        { priceLabel },
        {
          iconLayout: pin.layout,
          iconOffset: pin.offset,
          iconShape: { type: "Rectangle", coordinates: pin.shape },
          zIndex: 520,
        },
      );

      marker.events.add("click", () => {
        onSelect(location);
        onDetails(location);
      });
      marker.events.add("mouseenter", () => marker.options.set({
        iconLayout: layouts.selected.layout,
        iconOffset: layouts.selected.offset,
        iconShape: { type: "Rectangle", coordinates: layouts.selected.shape },
        zIndex: 780,
      }));
      marker.events.add("mouseleave", () => {
        const selected = selectedMarkerIdRef.current === markerId;
        const layout = selected ? layouts.selected : layouts.normal;
        marker.options.set({
          iconLayout: layout.layout,
          iconOffset: layout.offset,
          iconShape: { type: "Rectangle", coordinates: layout.shape },
          zIndex: selected ? 760 : 520,
        });
      });
      locationMarkersRef.current.push({ id: markerId, marker, layouts });
      locationCollectionRef.current.add(marker);
    });
  }, [locations, onDetails, onSelect, ready]);

  useEffect(() => {
    if (!ready || !mapRef.current) return undefined;

    if (routeRef.current) {
      mapRef.current.geoObjects.remove(routeRef.current);
      routeRef.current = null;
    }
    if (!routeTarget || !userPosition || !window.ymaps.multiRouter) {
      if (!routeTarget) routeDestinationIdRef.current = null;
      return undefined;
    }

    const destination = [Number(routeTarget.lat), Number(routeTarget.lon)];
    if (!Number.isFinite(destination[0]) || !Number.isFinite(destination[1])) return undefined;

    const destinationId = String(routeTarget.id);
    const isNewDestination = routeDestinationIdRef.current !== destinationId;
    routeDestinationIdRef.current = destinationId;
    const route = new window.ymaps.multiRouter.MultiRoute({
      referencePoints: [[userPosition.lat, userPosition.lon], destination],
      params: { routingMode: "auto", avoidTrafficJams: true },
    }, {
      // GPS yangilanganda viewport qayta-qayta sakramasin; faqat yangi manzilda moslashadi.
      boundsAutoApply: isNewDestination,
      wayPointVisible: false,
      routeActiveStrokeColor: "#facc15",
      routeActiveStrokeWidth: 6,
      routeStrokeColor: "#94a3b8",
      routeStrokeWidth: 3,
    });
    routeRef.current = route;
    mapRef.current.geoObjects.add(route);

    return () => {
      if (mapRef.current && routeRef.current === route) {
        mapRef.current.geoObjects.remove(route);
        routeRef.current = null;
      }
    };
  }, [ready, routeTarget, userPosition]);

  // Bu tugma har doim aynan foydalanuvchining o'z GPS nuqtasiga qaytadi,
  // marshrut faol bo'lsa ham.
  useEffect(() => {
    if (!ready || !mapRef.current || !userPosition || !locateVersion || processedLocateVersionRef.current === locateVersion) return;
    processedLocateVersionRef.current = locateVersion;
    mapRef.current.setCenter([userPosition.lat, userPosition.lon], 15, { duration: 450 });
  }, [locateVersion, ready, userPosition]);

  useEffect(() => {
    if (!ready || !mapRef.current || !markerLayoutsRef.current) return;

    if (!userPosition) {
      if (userMarkerRef.current) mapRef.current.geoObjects.remove(userMarkerRef.current);
      if (accuracyCircleRef.current) mapRef.current.geoObjects.remove(accuracyCircleRef.current);
      userMarkerRef.current = null;
      accuracyCircleRef.current = null;
      return;
    }

    const coords = [userPosition.lat, userPosition.lon];
    if (Number.isFinite(userPosition.accuracy) && userPosition.accuracy > 0) {
      const accuracyRadius = Math.min(Math.max(userPosition.accuracy, 25), MAX_ACCURACY_RADIUS);
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.geometry.setCoordinates(coords);
        accuracyCircleRef.current.geometry.setRadius(accuracyRadius);
      } else {
        accuracyCircleRef.current = new window.ymaps.Circle([coords, accuracyRadius], {}, {
          fillColor: "#0ea5e914",
          strokeColor: "#0284c7",
          strokeOpacity: 0.22,
          strokeWidth: 1,
        });
        mapRef.current.geoObjects.add(accuracyCircleRef.current);
      }
    } else if (accuracyCircleRef.current) {
      mapRef.current.geoObjects.remove(accuracyCircleRef.current);
      accuracyCircleRef.current = null;
    }

    if (userMarkerRef.current) {
      userMarkerRef.current.geometry.setCoordinates(coords);
    } else {
      userMarkerRef.current = new window.ymaps.Placemark(coords, { hintContent: "Mening joylashuvim" }, {
        iconLayout: markerLayoutsRef.current.user,
        iconShape: { type: "Circle", coordinates: [0, 0], radius: 28 },
        zIndex: 900,
      });
      mapRef.current.geoObjects.add(userMarkerRef.current);
    }
    if (!hasCenteredOnUserRef.current && !routeTarget) {
      hasCenteredOnUserRef.current = true;
      mapRef.current.setCenter(coords, 15, { duration: 450 });
    }
  }, [ready, routeTarget, userPosition]);

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
    if (!ready || !mapRef.current) return;

    const selectedId = selectedLocation ? String(selectedLocation.id) : null;
    const previousId = selectedMarkerIdRef.current;
    if (previousId && previousId !== selectedId) {
      const previous = locationMarkersRef.current.find((entry) => entry.id === previousId);
      if (previous) setMarkerLayout(previous.marker, previous.layouts.normal, 520);
    }

    if (selectedId) {
      const selected = locationMarkersRef.current.find((entry) => entry.id === selectedId);
      if (selected) setMarkerLayout(selected.marker, selected.layouts.selected, 760);
    }
    selectedMarkerIdRef.current = selectedId;
    if (!selectedLocation) return;

    const coords = [Number(selectedLocation.lat), Number(selectedLocation.lon)];
    if (!Number.isFinite(coords[0]) || !Number.isFinite(coords[1])) return;
    mapRef.current.setCenter(coords, 15, { duration: 350 });
  }, [locations, ready, selectedLocation]);

  return <div className="absolute inset-0 bg-[#0f172a]"><div className="pz-dark-map absolute inset-0" ref={mapNode} /><div className="pointer-events-none absolute inset-0 z-[1] bg-[#0f2742]/14" />{(!ready || scriptError) && <div className="absolute inset-0 z-20 grid place-items-center bg-[#020617]/90 p-6 text-center"><div><Navigation className="mx-auto text-yellow-300" size={44} /><p className="mt-3 text-sm font-black text-slate-300">{scriptError || "Xarita yuklanmoqda..."}</p></div></div>}<button aria-label="Mening joylashuvimga o'tish" className="btn btn-primary absolute right-2 top-[4.75rem] z-10 h-11 w-11 px-0 sm:right-4 sm:top-24 sm:w-auto sm:px-4 lg:top-6" onClick={onLocateMe} type="button"><LocateFixed size={16} /><span className="hidden sm:inline">Mening joylashuvim</span></button>{routeTarget && <button className="btn btn-secondary absolute left-3 top-[4.75rem] z-10 px-3 sm:left-4 sm:top-24" onClick={onClearRoute} type="button"><X size={15} />Yo‘nalishni yopish</button>}{locationError && <div className="absolute bottom-24 left-3 right-3 z-10 rounded-2xl border border-yellow-300/30 bg-[#020617]/90 px-4 py-3 text-sm font-bold text-yellow-100 backdrop-blur-xl sm:left-4 sm:right-4 lg:bottom-6 lg:right-auto">{locationError}</div>}</div>;
}

function createMarkerLayouts() {
  const categories = ["stadium", "playstation", "pc_club", "billiard"];
  return {
    locations: Object.fromEntries(categories.map((category) => [
      category,
      {
        normal: createLocationPinLayout(category, false),
        selected: createLocationPinLayout(category, true),
      },
    ])),
    user: window.ymaps.templateLayoutFactory.createClass(`
      <div class="pz-user-dot" style="position:relative;width:28px;height:28px;transform:translate(-14px,-14px);">
        <div style="position:absolute;inset:0;border-radius:999px;background:rgba(14,165,233,.14);"></div>
        <div style="position:absolute;left:5px;top:5px;width:18px;height:18px;border-radius:999px;background:#0ea5e9;border:4px solid #fff;box-shadow:0 8px 18px rgba(15,23,42,.24);"></div>
      </div>
    `),
  };
}

function setMarkerLayout(marker, layout, zIndex) {
  marker.options.set({
    iconLayout: layout.layout,
    iconOffset: layout.offset,
    iconShape: { type: "Rectangle", coordinates: layout.shape },
    zIndex,
  });
}

function createLocationPinLayout(category, selected) {
  const size = selected ? 50 : 42;
  const pinHeight = selected ? 64 : 54;
  const width = 160;
  const badgeHeight = 24;
  const gap = 4;
  const height = badgeHeight + gap + pinHeight;
  const image = escapeHtml(getIconByCategory(category));
  const scale = selected ? "1.08" : "1";
  const markup = `
    <div style="position:relative;width:${width}px;height:${height}px;transform:translateY(1px) scale(${scale});transform-origin:center bottom;">
      <span style="position:absolute;left:50%;top:0;max-width:${width - 8}px;height:${badgeHeight}px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transform:translateX(-50%);padding:4px 10px;border:1px solid ${selected ? "#fde047" : "#ffffff2b"};border-radius:999px;background:rgba(2,6,23,.96);color:#f8fafc;font:800 11px/14px Inter,Arial,sans-serif;box-shadow:0 3px 10px rgba(0,0,0,.4);">$[properties.priceLabel]</span>
      <svg aria-hidden="true" width="${size}" height="${pinHeight}" viewBox="0 0 42 54" style="position:absolute;left:${(width - size) / 2}px;top:${badgeHeight + gap}px;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.55));">
        <path d="M21 53C17 47 2 31 2 21a19 19 0 1 1 38 0c0 10-15 26-19 32Z" fill="#d1d5db" stroke="#5b6470" stroke-width="1.5"/>
        <path d="M21 49C16 42 5 30 5 21a16 16 0 1 1 32 0c0 9-11 21-16 28Z" fill="#f8fafc"/>
        <circle cx="21" cy="20" r="14.5" fill="#737b85"/>
        <circle cx="21" cy="19" r="13" fill="#111827" stroke="#fff" stroke-width="2"/>
      </svg>
      <span style="position:absolute;left:50%;top:${badgeHeight + gap + (selected ? 6 : 5)}px;width:${selected ? "27px" : "23px"};height:${selected ? "27px" : "23px"};overflow:hidden;border-radius:50%;transform:translateX(-50%);background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.55);">
        <img src="${image}" alt="" style="position:absolute;width:140%;height:140%;max-width:none;left:-20%;top:-20%;object-fit:cover;" />
      </span>
    </div>
  `;
  return {
    layout: window.ymaps.templateLayoutFactory.createClass(markup),
    offset: [-(width / 2), -height],
    shape: [[0, 0], [width, height]],
  };
}

function formatPrice(price) {
  const amount = Number(price);
  return Number.isFinite(amount) && amount > 0
    ? `${amount.toLocaleString("uz-UZ")} so‘m`
    : "Narx belgilanmagan";
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
