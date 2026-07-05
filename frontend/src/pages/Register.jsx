import { Gamepad2, MapPin, ShieldCheck, Star, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi.js";
import { getErrorMessage } from "../utils/errors.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return setError("Parollar mos emas.");
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Ro‘yxatdan o‘tishda xatolik."));
    } finally {
      setLoading(false);
    }
  };

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  return <AuthShell><form className="glass rounded-[2rem] p-6 sm:p-8" onSubmit={submit}><div className="mb-6"><span className="yellow-pill">Ro‘yxatdan o‘tish</span><h1 className="mt-4 text-3xl font-black text-white">Yangi account</h1><p className="mt-2 text-sm text-slate-400">Account yaratilgandan keyin kirish sahifasiga o‘tasiz.</p></div>{error && <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">{error}</div>}<div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2"><span className="label">Username</span><input className="input" required value={form.username} onChange={(e) => setField("username", e.target.value)} /></label><label className="space-y-2"><span className="label">Email</span><input className="input" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} /></label><label className="space-y-2 sm:col-span-2"><span className="label">Telefon</span><input className="input" maxLength={11} value={form.phone} onChange={(e) => setField("phone", e.target.value)} /></label><label className="space-y-2"><span className="label">Parol</span><input className="input" required type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} /></label><label className="space-y-2"><span className="label">Parolni tasdiqlash</span><input className="input" required type="password" value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} /></label></div><button className="btn btn-primary mt-5 w-full" disabled={loading}><UserPlus size={17} />{loading ? "Yaratilmoqda..." : "Ro‘yxatdan o‘tish"}</button><p className="mt-5 text-center text-sm text-slate-400">Account bormi? <Link className="font-black text-yellow-300 hover:underline" to="/login">Kirish</Link></p></form></AuthShell>;
}

function AuthShell({ children }) {
  return <div className="grid min-h-[calc(100vh-190px)] gap-8 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center"><section className="glass rounded-[2rem] p-8 sm:p-10"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-300 text-slate-950"><Gamepad2 size={24} /></span><span className="text-2xl font-black text-white">PlayZone</span></div><h2 className="mt-8 max-w-xl text-4xl font-black leading-tight text-white">Yaqiningdagi o‘yin va sport joylarini kashf eting</h2><div className="mt-8 space-y-4">{[["GPS asosida aniq joylashuv", MapPin], ["Shahar va reytinglar", Star], ["Tekshirilgan joylar", ShieldCheck]].map(([text, Icon]) => <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={text}><Icon className="text-yellow-300" size={20} /><span className="text-sm font-bold text-slate-300">{text}</span></div>)}</div></section><section>{children}</section></div>;
}
