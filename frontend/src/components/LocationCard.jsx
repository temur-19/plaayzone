import { MapPin, Navigation, Wallet } from "lucide-react";
import { categoryMeta, getLocationImageUrl } from "../api/locationApi.js";

export default function LocationCard({ location, distance, selected, onClick }) {
  const meta = categoryMeta[location.category] || { label: location.category, color: "#facc15" };
  const image = getLocationImageUrl(location);
  const price = location.price ? `${Number(location.price).toLocaleString("uz-UZ")} so‘m` : "Narx yo‘q";

  return (
    <button className={`location-card w-full shrink-0 overflow-hidden rounded-3xl border bg-[#111827]/85 text-left shadow-lg transition hover:-translate-y-1 ${selected ? "border-yellow-300 shadow-[0_0_32px_rgba(250,204,21,0.22)]" : "border-white/10 hover:border-yellow-300/50"}`} onClick={() => onClick(location)} type="button">
      <div className="location-card__content flex gap-3 p-3">
        <div className="location-card__image relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#020617]">
          <div className="grid h-full place-items-center"><MapPin className="text-yellow-300" size={24} /></div>
          {image && <img className="absolute inset-0 h-full w-full object-cover" src={image} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
        </div>
        <div className="min-w-0 flex-1">
          <span className="location-card__category rounded-full px-2.5 py-1 text-xs font-black text-slate-950" style={{ backgroundColor: meta.color }}>{meta.label}</span>
          <h3 className="location-card__title mt-2 truncate text-base font-black text-white">{location.name}</h3>
          <p className="location-card__description mt-1 line-clamp-2 text-sm leading-5 text-slate-400">{location.description || "Tavsif kiritilmagan."}</p>
          <div className="location-card__meta mt-2 flex flex-wrap gap-2 text-xs font-black text-yellow-200"><span className="inline-flex items-center gap-1"><Wallet size={13} />{price}</span><span className="inline-flex items-center gap-1"><Navigation size={13} />{distance == null ? "Masofa mavjud emas" : `${distance.toFixed(1)} km uzoqlikda`}</span></div>
        </div>
      </div>
    </button>
  );
}
