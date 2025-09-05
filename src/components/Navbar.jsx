// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.webp";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();

  // Re-check auth whenever the route changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location.pathname]);

  // React to storage changes
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowLogoutPopup(false);
    // Optional redirect
    // window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-purple-100 via-pink-50 to-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          {/* Brand */}
          <img src={logo} alt="Logo" className="h-30 w-30" />

          {/* Links */}
          <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <li>
              <a href="#home" className="hover:text-purple-600">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-purple-600">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-purple-600">
                Services
              </a>
            </li>
            <li>
              <a href="#footer" className="hover:text-purple-600">
                Contact
              </a>
            </li>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
            {/* Close button */}
            <button
              onClick={() => setShowLogoutPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            ></button>

            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogoutConfirm}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-6 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
