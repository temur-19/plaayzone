import { Gamepad2, LogOut, MapPinned } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminShell({ children, title = "Lokatsiyalar boshqaruvi" }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const logout = async () => { await signOut(); navigate("/"); };
  return (
    <div className="min-h-screen bg-[#020617] text-white lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-white/10 bg-[#050b18] p-4 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-300 text-slate-950"><Gamepad2 size={24} /></span><div><p className="text-lg font-black">PlayZone Admin</p><p className="text-xs font-bold text-slate-500">Boshqaruv paneli</p></div></div>
        <nav className="mt-8 flex gap-2 lg:flex-col"><NavLink className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${isActive ? "bg-yellow-300 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-yellow-200"}`} to="/admin/locations"><MapPinned size={18} />Lokatsiyalar</NavLink></nav>
        <button className="btn btn-secondary mt-8 w-full lg:mt-[calc(100vh-220px)]" onClick={logout} type="button"><LogOut size={16} />Chiqish</button>
      </aside>
      <main className="p-4 sm:p-6 lg:p-8"><div className="mb-6"><span className="yellow-pill">Admin</span><h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">{title}</h1></div>{children}</main>
    </div>
  );
}
