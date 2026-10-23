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
        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0"><NavLink className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${isActive ? "bg-yellow-300 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-yellow-200"}`} to="/admin/locations"><MapPinned size={18} />Lokatsiyalar</NavLink></nav>
        <button className="btn btn-secondary mt-4 w-full lg:mt-[calc(100vh-220px)]" onClick={logout} type="button"><LogOut size={16} />Chiqish</button>
      </aside>
      <main className="min-w-0 p-3 sm:p-6 lg:p-8"><div className="mb-5 sm:mb-6"><span className="yellow-pill">Admin</span><h1 className="mt-3 text-2xl font-black text-white sm:mt-4 sm:text-4xl">{title}</h1></div>{children}</main>
    </div>
  );
}
