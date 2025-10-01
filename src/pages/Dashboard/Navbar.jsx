// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.webp";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Auth check in one place
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (!token || !loginTime) return false;

    const sessionLimit = 60 * 60 * 1000; // 1 hour
    const now = Date.now();

    if (now - parseInt(loginTime, 10) > sessionLimit) {
      handleLogout(true); // auto-logout
      return false;
    }
    return true;
  };

  // 🔹 Logout handler (manual or auto)
  const handleLogout = (auto = false) => {
    ["token", "user", "loginTime"].forEach((key) =>
      localStorage.removeItem(key)
    );
    setIsLoggedIn(false);
    setShowLogoutPopup(false);
    if (!auto) navigate("/", { replace: true });
  };

  // ✅ Run on mount, route change, and every 10s
  useEffect(() => {
    setIsLoggedIn(checkAuth());
    const interval = setInterval(() => setIsLoggedIn(checkAuth()), 10000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // ✅ React to storage changes (multi-tab sync)
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-purple-100 via-pink-50 to-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          {/* Brand */}
          <img src={logo} alt="Logo" className="h-30 w-30" />

          {/* Links */}
          <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
            {["Home", "About", "Services", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-purple-600"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          {/* Auth Buttons */}
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <button
                onClick={() => setShowLogoutPopup(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mr-12"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-6 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLogout(false)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
