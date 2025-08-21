// import { useState, useCallback } from "react";
// import Navbar from "./components/Navbar";
// import Dashboard from "./pages/Dashboard";
// import AuthModal from "./components/AuthModal";

// export default function App() {
//   const [authOpen, setAuthOpen] = useState(false);
//   const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'

//   const openLogin = useCallback(() => {
//     setAuthMode("login");
//     setAuthOpen(true);
//   }, []);
//   const openRegister = useCallback(() => {
//     setAuthMode("register");
//     setAuthOpen(true);
//   }, []);
//   const closeAuth = useCallback(() => setAuthOpen(false), []);
//   const switchMode = useCallback((mode) => setAuthMode(mode), []);

//   return (
//     <>
//       <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
//       <Dashboard />
//       <AuthModal
//         open={authOpen}
//         mode={authMode}
//         onClose={closeAuth}
//         onSwitchMode={switchMode}
//       />
//     </>
//   );
// }
import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

// Add these imports
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Footer from "./pages/Footer";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'

  // ----------------------
  // Auth modal handlers
  // ----------------------
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
      {/* Navbar */}
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

      {/* Sections with IDs for scrolling */}
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

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {authMode === "login" ? (
            <LoginForm
              onSuccess={closeAuth}
              onSwitch={() => switchMode("register")}
              onClose={closeAuth}
            />
          ) : (
            <RegisterForm
              onSuccess={closeAuth}
              onSwitch={() => switchMode("login")}
              onClose={closeAuth}
            />
          )}
        </div>
      )}
    </div>
  );
}
