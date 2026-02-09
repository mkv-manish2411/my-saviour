import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  HeartPulse,
  History,
  User,
  LogOut,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Eligibility",
    to: "/dashboard/eligibility",
    icon: HeartPulse,
  },
  {
    name: "Last Donated",
    to: "/dashboard/last-donated",
    icon: History,
  },
  {
    name: "Profile",
    to: "/dashboard/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-red-500">My Savior</h1>
        <p className="text-xs text-zinc-400">Donor Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 py-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
