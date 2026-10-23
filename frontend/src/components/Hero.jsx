import { ArrowRight, Gamepad2, MapPin, MousePointer2, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const markers = [
  ["Stadion", "bg-emerald-400", "left-[18%] top-[28%]"],
  ["PlayStation", "bg-red-500", "right-[18%] top-[22%]"],
  ["Billiard", "bg-purple-500", "left-[26%] bottom-[24%]"],
  ["PC Club", "bg-yellow-300", "right-[18%] bottom-[18%]"],
];

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section id="home" className="grid gap-6 py-6 sm:gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12 lg:py-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-4 py-2 text-sm font-black text-yellow-200"><Sparkles size={16} />PlayZone.uz</div>
        <h1 className="mt-6 max-w-4xl text-[clamp(2rem,9vw,3rem)] font-black leading-tight text-white sm:text-6xl lg:text-7xl">Yaqiningdagi <span className="text-yellow-300">o‘yin joylarini</span> bir zumda toping</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:mt-6 sm:text-lg sm:leading-8">PlayZone orqali mini stadion, billiard, PC club va PlayStation markazlarini xaritada tez toping.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="btn btn-primary home-link" to={isAuthenticated ? "/map" : "/register"}>Bepul boshlash <ArrowRight size={17} /></Link>
          <a className="btn btn-secondary home-link" href="#how">Qanday ishlaydi</a>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4">
          {[["Joylar bazada", "100+"], ["Kategoriyalar", "4"], ["Foydalanuvchilar", "1K+"], ["24/7", "yangilanish"]].map(([label, value]) => <div className="glass rounded-3xl p-4" key={label}><p className="text-2xl font-black text-yellow-300">{value}</p><p className="mt-1 text-xs font-bold text-slate-400">{label}</p></div>)}
        </div>
      </div>
      <div className="glass relative overflow-hidden rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-5">
        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-black text-white"><Gamepad2 className="text-yellow-300" size={18} />Jonli xarita ko‘rinishi</div><span className="yellow-pill">JONLI</span></div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#050b18]">
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,.16),transparent_22rem)]" />
          {markers.map(([label, color, pos]) => <div className={`absolute ${pos} flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-xs font-black text-white shadow-[0_0_30px_rgba(250,204,21,0.16)]`} key={label}><span className={`h-3 w-3 rounded-full ${color} shadow-[0_0_18px_currentColor]`} />{label}</div>)}
          <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-yellow-300 text-slate-950 ring-[18px] ring-yellow-300/10"><MapPin size={26} /></div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[['GPS asosida', MapPin], ['Tez qidirish', MousePointer2], ['Tekshirilgan joylar', ShieldCheck]].map(([title, Icon]) => <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4" key={title}><Icon className="text-yellow-300" size={20} /><p className="mt-3 text-sm font-black text-white">{title}</p></div>)}
        </div>
      </div>
    </section>
  );
}
