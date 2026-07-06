import { MapPin, Navigation, Phone, Wallet, X } from "lucide-react";
import { categoryMeta, getLocationImageUrl } from "../api/locationApi.js";

export default function LocationModal({ location, distance, onClose }) {
  if (!location) return null;
  const meta = categoryMeta[location.category] || { label: location.category, color: "#facc15" };
  const image = getLocationImageUrl(location);
  const routeUrl = `https://yandex.com/maps/?rtext=~${location.lat},${location.lon}&rtt=auto`;
  const phoneNumber = location.phone_number ? `+998 ${location.phone_number}` : "Telefon kiritilmagan";
  const callUrl = location.phone_number ? `tel:+998${location.phone_number}` : undefined;
  const price = location.price ? `${Number(location.price).toLocaleString("uz-UZ")} so‘m` : "Narx kiritilmagan";

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/70 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" onClick={onClose}>
      <article className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#0f172a]/95 shadow-[0_24px_90px_rgba(0,0,0,0.7)] sm:max-w-2xl sm:rounded-[2rem]" onClick={(event) => event.stopPropagation()}>
        <div className="relative aspect-[16/8] bg-[#020617]">{image ? <img className="h-full w-full object-cover" src={image} alt={location.name} /> : <div className="grid h-full place-items-center text-sm font-black text-slate-500">Rasm mavjud emas</div>}<button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-[#020617]/80 text-white" onClick={onClose} type="button"><X size={20} /></button></div>
        <div className="space-y-5 p-5 sm:p-6"><div><span className="rounded-full px-3 py-1 text-xs font-black text-slate-950" style={{ backgroundColor: meta.color }}>{meta.label}</span><h2 className="mt-4 text-3xl font-black text-white">{location.name}</h2><p className="mt-3 leading-7 text-slate-400">{location.description || "Tavsif serverda kiritilmagan."}</p></div><div className="grid gap-3 sm:grid-cols-2"><Info icon={Phone} label="Telefon" value={phoneNumber} /><Info icon={Wallet} label="Narx" value={price} /><Info icon={Navigation} label="Masofa" value={distance == null ? "Joylashuv ruxsati yo‘q" : `${distance.toFixed(2)} km`} /><Info icon={MapPin} label="Koordinata" value={`${location.lat}, ${location.lon}`} /></div><div className="flex flex-col gap-3 sm:flex-row">{callUrl ? <a className="btn btn-secondary flex-1" href={callUrl}><Phone size={16} />Telefon qilish</a> : <button className="btn btn-secondary flex-1" disabled type="button"><Phone size={16} />Telefon yo‘q</button>}<a className="btn btn-primary flex-1" href={routeUrl} target="_blank" rel="noreferrer"><Navigation size={16} />Yo‘nalish olish</a></div></div>
      </article>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500"><Icon size={14} />{label}</p><p className="mt-2 text-sm font-bold text-slate-200">{value}</p></div>;
}
