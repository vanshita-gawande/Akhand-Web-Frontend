import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./pages/Dashboard/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterFolder/RegisterForm";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard/Admindashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard/SuperAdminDashboard";

// Common Footer
import Footer from "./CommonFiles/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// -----------------------
// Public Layout
// -----------------------
function PublicLayout({ onLoginClick, onRegisterClick }) {
  return (
    <>
      <Navbar onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      <section id="home">
        <Dashboard
          onLoginClick={onLoginClick}
          onRegisterClick={onRegisterClick}
        />
      </section>
    </>
  );
}

// -----------------------
// Protected Layout
// -----------------------
function ProtectedLayout({ children }) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
}

// -----------------------
// App Content
// -----------------------
export default function AppContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const navigate = useNavigate();

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  const closeAuth = () => setAuthOpen(false);
  const switchMode = (mode) => setAuthMode(mode);

  return (
    <div className="scroll-smooth">
      {/* Routes */}
      <Routes>
        {/* Public Dashboard */}
        <Route
          path="/"
          element={
            <PublicLayout
              onLoginClick={openLogin}
              onRegisterClick={openRegister}
            />
          }
        />

        {/* User Dashboard */}
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute role="user">
              <ProtectedLayout>
                <UserDashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="admin">
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* SuperAdmin Dashboard */}
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute role="superadmin">
              <ProtectedLayout>
                <SuperAdminDashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {authMode === "login" ? (
            <LoginForm
              onSuccess={() => {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                setAuthOpen(false);

                // Navigate based on role
                if (user.role === "superadmin") {
                  navigate("/superadmin/dashboard", { replace: true });
                } else if (user.role === "admin") {
                  navigate("/admindashboard", { replace: true });
                } else {
                  navigate("/userdashboard", { replace: true });
                }
              }}
              onSwitch={() => switchMode("register")}
              onClose={closeAuth}
            />
          ) : (
            <RegisterForm
              onSuccess={() => setAuthMode("login")}
              onSwitch={() => switchMode("login")}
              onClose={closeAuth}
            />
          )}
        </div>
      )}
    </div>
  );
}
