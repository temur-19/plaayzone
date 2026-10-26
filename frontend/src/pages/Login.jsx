import { Gamepad2, LogIn, MapPin, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const isAdminLogin = location.pathname === "/admin/login";
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const auth = await signIn({ ...form, adminMode: isAdminLogin });
      const destination = isAdminLogin
        ? "/admin"
        : (location.state?.from?.pathname || (auth.isAdmin ? "/admin" : "/map"));
      navigate(destination, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Login yoki parol xato."));
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell title="Yaqiningdagi o‘yin va sport joylarini kashf eting"><form className="glass rounded-[2rem] p-6 sm:p-8" onSubmit={submit}><div className="mb-6"><span className="yellow-pill">{isAdminLogin ? "Admin kirish" : "Kirish"}</span><h1 className="mt-4 text-3xl font-black text-white">{isAdminLogin ? "Admin panelga kirish" : "Accountga kirish"}</h1><p className="mt-2 text-sm text-slate-400">{isAdminLogin ? "Faqat administrator hisobi bilan kirish mumkin." : "Kirgandan so‘ng xarita sahifasiga yo‘naltirilasiz."}</p></div>{error && <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{error}</div>}<div className="space-y-4"><label className="block space-y-2"><span className="label">Username</span><input className="input" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label><label className="block space-y-2"><span className="label">Parol</span><input className="input" required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><button className="btn btn-primary w-full" disabled={loading}><LogIn size={17} />{loading ? "Kirilmoqda..." : "Kirish"}</button></div><p className="mt-5 text-center text-sm text-slate-400">{isAdminLogin ? <>Oddiy foydalanuvchimisiz? <Link className="font-black text-yellow-300 hover:underline" to="/login">Oddiy kirish</Link></> : <>Account yo‘qmi? <Link className="font-black text-yellow-300 hover:underline" to="/register">Ro‘yxatdan o‘tish</Link><span className="mx-2 text-slate-600">•</span><Link className="font-black text-slate-300 hover:text-yellow-300 hover:underline" to="/admin/login">Admin kirish</Link></>}</p></form></AuthShell>;
}

function AuthShell({ title, children }) {
  return <div className="grid min-h-[calc(100dvh-150px)] gap-5 py-4 sm:gap-8 sm:py-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"><section className="order-2 rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-10 lg:order-1 glass"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-300 text-slate-950"><Gamepad2 size={24} /></span><span className="text-2xl font-black text-white">PlayZone</span></div><h2 className="mt-6 max-w-xl text-3xl font-black leading-tight text-white sm:mt-8 sm:text-4xl">{title}</h2><div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">{[["GPS asosida aniq joylashuv", MapPin], ["Shahar va reytinglar uchun tayyor platforma", Star], ["Tekshirilgan joylar", ShieldCheck]].map(([text, Icon]) => <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4" key={text}><Icon className="shrink-0 text-yellow-300" size={20} /><span className="text-sm font-bold text-slate-300">{text}</span></div>)}</div></section><section className="order-1 min-w-0 lg:order-2">{children}</section></div>;
}
