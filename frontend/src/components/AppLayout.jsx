import { LogOut, MapPinned, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition ${
    isActive ? "bg-ocean text-white" : "text-slate-700 hover:bg-slate-100 hover:text-ocean"
  }`;

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, auth, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-black text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-ocean text-white">
              <MapPinned size={22} />
            </span>
            Online IT Platform
          </Link>
          <button className="btn btn-secondary px-3 md:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLinks isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <UserRound size={16} />
                  {auth?.user?.username || "User"}
                </span>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-secondary" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-2" onClick={() => setOpen(false)}>
              <NavLinks isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
              {isAuthenticated ? (
                <button className="btn btn-secondary mt-2" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              ) : (
                <Link className="btn btn-primary mt-2" to="/login">
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

function NavLinks({ isAuthenticated, isAdmin }) {
  return (
    <>
      <NavLink className={navLinkClass} to="/">
        Home
      </NavLink>
      {isAuthenticated && (
        <NavLink className={navLinkClass} to="/locations">
          Locations
        </NavLink>
      )}
      {isAdmin && (
        <NavLink className={navLinkClass} to="/dashboard">
          Dashboard
        </NavLink>
      )}
      {isAuthenticated && (
        <NavLink className={navLinkClass} to="/profile">
          Profile
        </NavLink>
      )}
    </>
  );
}
