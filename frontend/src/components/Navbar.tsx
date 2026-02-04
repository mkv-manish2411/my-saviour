import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const registerRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        registerRef.current &&
        !registerRef.current.contains(e.target as Node)
      ) {
        setOpenRegister(false);
      }

      if (
        loginRef.current &&
        !loginRef.current.contains(e.target as Node)
      ) {
        setOpenLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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
          <span className="text-white">-Saviour</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 relative">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/donors" className={linkClass}>
            Donors
          </NavLink>

          {/* ================= NOT LOGGED IN ================= */}
          {!isLoggedIn && (
            <>
              {/* REGISTER DROPDOWN */}
              <div className="relative" ref={registerRef}>
                <button
                  onClick={() => {
                    setOpenRegister(!openRegister);
                    setOpenLogin(false);
                  }}
                  className="text-sm font-medium text-zinc-300 hover:text-white"
                >
                  Register ▾
                </button>

                {openRegister && (
                  <div className="absolute mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg w-52">
                    <Link
                      to="/register"
                      onClick={() => setOpenRegister(false)}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      User Register
                    </Link>

                    <Link
                      to="/organization/register"
                      onClick={() => setOpenRegister(false)}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      Organization Register
                    </Link>
                  </div>
                )}
              </div>

              {/* LOGIN DROPDOWN */}
              <div className="relative" ref={loginRef}>
                <button
                  onClick={() => {
                    setOpenLogin(!openLogin);
                    setOpenRegister(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                >
                  Login ▾
                </button>

                {openLogin && (
                  <div className="absolute right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg w-52">
                    <Link
                      to="/login"
                      onClick={() => setOpenLogin(false)}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      User Login
                    </Link>

                    <Link
                      to="/organization/login"
                      onClick={() => setOpenLogin(false)}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                      Organization Login
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= LOGGED IN ================= */}
          {isLoggedIn && (
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

        {/* Mobile menu icon (future enhancement) */}
        <button className="md:hidden text-zinc-300 text-xl">☰</button>
      </nav>
    </header>
  );
}
