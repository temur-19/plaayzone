import { Gamepad2, LogIn, MapPin, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../utils/errors.js";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", adminMode: Boolean(location.state?.adminMode) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const auth = await signIn(form);
      navigate(location.state?.from?.pathname || (auth.isAdmin ? "/management/admin" : "/map"), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Login yoki parol xato."));
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell title="Yaqiningdagi o‘yin va sport joylarini kashf eting"><form className="glass rounded-[2rem] p-6 sm:p-8" onSubmit={submit}><div className="mb-6"><span className="yellow-pill">Kirish</span><h1 className="mt-4 text-3xl font-black text-white">Accountga kirish</h1><p className="mt-2 text-sm text-slate-400">Kirgandan so‘ng xarita sahifasiga yo‘naltirilasiz.</p></div>{error && <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{error}</div>}<div className="space-y-4"><label className="block space-y-2"><span className="label">Username</span><input className="input" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label><label className="block space-y-2"><span className="label">Parol</span><input className="input" required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-black text-slate-300"><input checked={form.adminMode} type="checkbox" onChange={(e) => setForm({ ...form, adminMode: e.target.checked })} />Admin sifatida kirish</label><button className="btn btn-primary w-full" disabled={loading}><LogIn size={17} />{loading ? "Kirilmoqda..." : "Kirish"}</button></div><p className="mt-5 text-center text-sm text-slate-400">Account yo‘qmi? <Link className="font-black text-yellow-300 hover:underline" to="/register">Ro‘yxatdan o‘tish</Link></p></form></AuthShell>;
}

function AuthShell({ title, children }) {
  return <div className="grid min-h-[calc(100vh-190px)] gap-8 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"><section className="glass rounded-[2rem] p-8 sm:p-10"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-300 text-slate-950"><Gamepad2 size={24} /></span><span className="text-2xl font-black text-white">PlayZone</span></div><h2 className="mt-8 max-w-xl text-4xl font-black leading-tight text-white">{title}</h2><div className="mt-8 space-y-4">{[["GPS asosida aniq joylashuv", MapPin], ["Shahar va reytinglar uchun tayyor platforma", Star], ["Tekshirilgan joylar", ShieldCheck]].map(([text, Icon]) => <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={text}><Icon className="text-yellow-300" size={20} /><span className="text-sm font-bold text-slate-300">{text}</span></div>)}</div></section><section>{children}</section></div>;
}
