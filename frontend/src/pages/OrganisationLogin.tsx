import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
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
const res = await api.post("/org/login", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "org");
      navigate("/org/dashboard");
    } catch (err: any) {
      if (err.response?.status === 403) {
        navigate("/not-approved");
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-1">
          Organization Login
        </h2>
        <p className="text-zinc-400 mb-6">
          Login after admin approval
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-900/40 border border-red-700 text-red-300 px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              placeholder="org@email.com"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Don’t have an organization account?{" "}
          <span
            onClick={() => navigate("/organization/register")}
            className="text-red-500 hover:text-red-400 cursor-pointer font-medium"
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
}
