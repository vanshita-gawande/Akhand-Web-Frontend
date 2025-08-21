import React from "react";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  return (
    <header className="bg-gradient-to-r from-purple-100 via-pink-50 to-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-purple-700">
            ✨ Akhand Solutions
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li>
            <a
              href="#home"
              className="hover:text-purple-600 cursor-pointer transition duration-300"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="hover:text-purple-600 cursor-pointer transition duration-300"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#services"
              className="hover:text-purple-600 cursor-pointer transition duration-300"
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="#footer"
              className="hover:text-purple-600 cursor-pointer transition duration-300"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition"
            onClick={onLoginClick}
          >
            Login
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            onClick={onRegisterClick}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Optional) */}
      {/* You can later add a hamburger menu for mobile */}
    </header>
  );
}
