import { BriefcaseBusiness, House, MapPinned, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const items = [
  { to: "/map", label: "Xarita", Icon: MapPinned },
  { to: "/locations/add", label: "Joy qo‘shish", Icon: Plus },
  { to: "/my-locations", label: "Xizmatlarim", Icon: BriefcaseBusiness },
  { to: "/", label: "Bosh sahifa", Icon: House, end: true },
];

export default function MobileBottomNav() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav aria-label="Asosiy navigatsiya" className="mobile-bottom-nav sm:hidden">
      {items.map(({ to, label, Icon, end }) => (
        <NavLink
          aria-label={label}
          className={({ isActive }) => `mobile-bottom-nav__item${isActive ? " is-active" : ""}`}
          end={end}
          key={to}
          title={label}
          to={to}
        >
          <Icon aria-hidden="true" size={21} strokeWidth={2.4} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
