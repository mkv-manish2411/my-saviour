import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminRoutes from "./routes/AdminRoutes";

// Public pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const RegisterOrganization = lazy(() => import("./pages/RegisterOrganization"));
const LoginOrganization = lazy(() => import("./pages/OrganisationLogin"));
const Donors = lazy(() => import("./pages/Donors"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Donor dashboard pages
const DonorDashboard = lazy(() => import("./pages/dashboard/DonorDashboard"));
const DonorLastDonated = lazy(() => import("./pages/dashboard/LastDonated"));
const DonorProfile = lazy(() => import("./pages/dashboard/Profile"));

/* ===== Layout for public pages ===== */
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* ============ PUBLIC ROUTES ============ */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/donors" element={<Donors />} />

            {/* Organization */}
            <Route
              path="/organization/register"
              element={<RegisterOrganization />}
            />
            <Route
              path="/organization/login"
              element={<LoginOrganization />}
            />
          </Route>

          {/* ============ DONOR DASHBOARD ============ */}
          <Route path="/dashboard" element={<DonorDashboard />}> 
            
            <Route path="last-donated" element={<DonorLastDonated />} />
            <Route path="profile" element={<DonorProfile />} />
          </Route>

          {/* ============ ADMIN ============ */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* ============ 404 ============ */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
