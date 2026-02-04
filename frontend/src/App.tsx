import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminRoutes from "./routes/AdminRoutes";

// Lazy loaded pages (performance optimized)
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const RegisterOrganization = lazy(() => import("./pages/RegisterOrganization"));
const LoginOrganization = lazy(() => import("./pages/OrganisationLogin"));
const Donors = lazy(() => import("./pages/Donors"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar for public & org users */}
      <Navbar />

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donors" element={<Donors />} />

          {/* Organization Registration */}
          <Route
            path="/organization/register"
            element={<RegisterOrganization />}
          />

          {/* Organization Login */}
          <Route
            path="/organization/login"
            element={<LoginOrganization />}
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* ================= 404 ================= */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
