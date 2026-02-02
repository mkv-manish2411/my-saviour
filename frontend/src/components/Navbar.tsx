import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-red-600"
        : "text-zinc-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold">
          <span className="text-red-600">My</span>
          <span className="text-white">-Savior</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/donors" className={linkClass}>
            Donors
          </NavLink>

          {!isLoggedIn ? (
            <>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>

              <NavLink
                to="/login"
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <button
                onClick={handleLogout}
                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile placeholder (future menu) */}
        <button className="md:hidden text-zinc-300 text-xl">☰</button>
      </nav>
    </header>
  );
}
