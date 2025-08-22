import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

// Pages
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Footer from "./pages/Footer";

// -----------------------
// Public layout component
// -----------------------
function PublicLayout({ onLoginClick, onRegisterClick }) {
  return (
    <>
      <Navbar onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      <section id="home">
        <Dashboard />
      </section>
      <section id="about">
        <AboutUs />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="footer">
        <Footer />
      </section>
    </>
  );
}

// -----------------------
// AppContent
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
      <Routes>
        {/* ✅ Public pages */}
        <Route
          path="/"
          element={
            <PublicLayout
              onLoginClick={openLogin}
              onRegisterClick={openRegister}
            />
          }
        />

        {/* ✅ User dashboard (completely separate page) */}
        <Route path="/userdashboard" element={<UserDashboard />} />
      </Routes>

      {/* ✅ Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {authMode === "login" ? (
            <LoginForm
              onSuccess={() => {
                setAuthOpen(false);
                navigate("/userdashboard"); // redirect to user dashboard
              }}
              onSwitch={() => switchMode("register")}
              onClose={closeAuth}
            />
          ) : (
            <RegisterForm
              onSuccess={() => {
                setAuthMode("login"); // after register → login
              }}
              onSwitch={() => switchMode("login")}
              onClose={closeAuth}
            />
          )}
        </div>
      )}
    </div>
  );
}
