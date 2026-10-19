import { MapPin, MousePointer2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadYandexMaps } from "../utils/yandexMaps.js";

const DEFAULT_CENTER = [41.3111, 69.2797];

export default function LocationPicker({ apiKey, value, onChange }) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  valueRef.current = value;

  useEffect(() => {
    if (!apiKey) return undefined;
    let active = true;

    loadYandexMaps(apiKey)
      .then(() => window.ymaps.ready(() => {
        if (!active || !mapNode.current || mapRef.current) return;
        const lat = Number(valueRef.current.lat);
        const lon = Number(valueRef.current.lon);
        const hasLocation = Number.isFinite(lat) && Number.isFinite(lon);
        const map = new window.ymaps.Map(mapNode.current, {
          center: hasLocation ? [lat, lon] : DEFAULT_CENTER,
          zoom: hasLocation ? 15 : 12,
          controls: ["zoomControl", "fullscreenControl"],
        });
        mapRef.current = map;
        resizeObserverRef.current = new ResizeObserver(() => map.container.fitToViewport());
        resizeObserverRef.current.observe(mapNode.current);
        requestAnimationFrame(() => map.container.fitToViewport());

        const placeMarker = (coords) => {
          if (!markerRef.current) {
            markerRef.current = new window.ymaps.Placemark(coords, {
              hintContent: "Tanlangan joy",
            }, {
              preset: "islands#yellowIcon",
              draggable: true,
            });
            markerRef.current.events.add("dragend", () => {
              const markerCoords = markerRef.current.geometry.getCoordinates();
              onChangeRef.current({ lat: markerCoords[0].toFixed(6), lon: markerCoords[1].toFixed(6) });
            });
            map.geoObjects.add(markerRef.current);
          } else {
            markerRef.current.geometry.setCoordinates(coords);
          }
          onChangeRef.current({ lat: coords[0].toFixed(6), lon: coords[1].toFixed(6) });
        };

        map.events.add("click", (event) => placeMarker(event.get("coords")));
        if (hasLocation) {
          markerRef.current = new window.ymaps.Placemark([lat, lon], {
            hintContent: "Tanlangan joy",
          }, {
            preset: "islands#yellowIcon",
            draggable: true,
          });
          markerRef.current.events.add("dragend", () => {
            const markerCoords = markerRef.current.geometry.getCoordinates();
            onChangeRef.current({ lat: markerCoords[0].toFixed(6), lon: markerCoords[1].toFixed(6) });
          });
          map.geoObjects.add(markerRef.current);
        }
        setReady(true);
      }))
      .catch(() => {
        if (active) setError("Xarita yuklanmadi. Internet aloqasi yoki Yandex Maps API kalitini tekshiring.");
      });

    return () => {
      active = false;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [apiKey]);

  const hasLocation = value.lat !== "" && value.lon !== "";

  return (
    <section className="space-y-3">
      <div>
        <h2 className="label">Xaritadan joy tanlang</h2>
        <p className="mt-1 text-sm text-slate-400">Xaritani bosing yoki belgini kerakli joyga sudrang.</p>
      </div>
      <div className="relative h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] sm:h-[430px]">
        <div className="absolute inset-0" ref={mapNode} />
        {!ready && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-[#020617]/80 p-6 text-center">
            <p className={`max-w-sm text-sm font-bold ${error ? "text-red-200" : "text-slate-300"}`}>
              {error || "Xarita yuklanmoqda..."}
            </p>
          </div>
        )}
        {ready && !hasLocation && (
          <div className="pointer-events-none absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#020617]/85 px-4 py-2 text-xs font-black text-white shadow-lg backdrop-blur">
            <MousePointer2 className="text-yellow-300" size={15} />
            Belgilash uchun xaritani bosing
          </div>
        )}
      </div>
      <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${hasLocation ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-200" : "border-yellow-300/20 bg-yellow-300/5 text-yellow-100"}`}>
        <MapPin size={18} />
        {hasLocation ? `Tanlandi: ${value.lat}, ${value.lon}` : "Joylashuvni xaritadan tanlang"}
      </div>
    </section>
  );
}
