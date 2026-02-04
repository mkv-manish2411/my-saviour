import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      setLoading(true);
      const res = await api.post("/admin/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");

      navigate("/admin/dashboard");
    } catch {
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-1">
          Admin Login
        </h2>
        <p className="text-zinc-400 mb-6">
          Restricted access — admins only
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-900/40 border border-red-700 text-red-300 px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Admin Email</label>
            <input
              name="email"
              type="email"
              placeholder="admin@mysavior.com"
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login as Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} My-Savior · Admin Panel
        </div>
      </div>
    </div>
  );
}
