import { Gamepad2, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navClass = ({ isActive }) => `rounded-2xl px-4 py-2 text-sm font-black transition ${isActive ? "bg-yellow-300 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-yellow-200"}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, signOut } = useAuth();

  const logout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-yellow-300 text-slate-950 shadow-[0_0_36px_rgba(250,204,21,0.35)]"><Gamepad2 size={23} /></span>
          <span className="text-xl font-black tracking-wide text-white">PlayZone</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          <a className="rounded-2xl px-4 py-2 text-sm font-black text-slate-300 hover:text-yellow-200" href="/#home">Bosh sahifa</a>
          <a className="rounded-2xl px-4 py-2 text-sm font-black text-slate-300 hover:text-yellow-200" href="/#how">Qanday ishlaydi</a>
          <a className="rounded-2xl px-4 py-2 text-sm font-black text-slate-300 hover:text-yellow-200" href="/#categories">Kategoriyalar</a>
          <a className="rounded-2xl px-4 py-2 text-sm font-black text-slate-300 hover:text-yellow-200" href="/#about">Biz haqimizda</a>
          {isAuthenticated && <NavLink className={navClass} to="/map">Xarita</NavLink>}
          {isAdmin && <NavLink className={navClass} to="/management/admin">Admin</NavLink>}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? <button className="btn btn-secondary" onClick={logout} type="button"><LogOut size={16} />Chiqish</button> : <><Link className="btn btn-secondary" to="/login">Kirish</Link><Link className="btn btn-primary" to="/register">Ro‘yxatdan o‘tish</Link></>}
        </div>
        <button className="btn btn-secondary px-3 lg:hidden" onClick={() => setOpen((value) => !value)} type="button">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[#050b18] px-4 py-4 lg:hidden" onClick={() => setOpen(false)}>
          <nav className="flex flex-col gap-2">
            <a className="rounded-2xl px-4 py-2 text-sm font-black text-slate-300" href="/#home">Bosh sahifa</a>
            <a className="rounded-2xl px-4 py-2 text-sm font-black text-slate-300" href="/#how">Qanday ishlaydi</a>
            <a className="rounded-2xl px-4 py-2 text-sm font-black text-slate-300" href="/#categories">Kategoriyalar</a>
            <a className="rounded-2xl px-4 py-2 text-sm font-black text-slate-300" href="/#about">Biz haqimizda</a>
            {isAuthenticated && <NavLink className={navClass} to="/map">Xarita</NavLink>}
            {isAdmin && <NavLink className={navClass} to="/management/admin">Admin</NavLink>}
            {isAuthenticated ? <button className="btn btn-secondary" onClick={logout} type="button"><LogOut size={16} />Chiqish</button> : <Link className="btn btn-primary" to="/login">Kirish</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}
