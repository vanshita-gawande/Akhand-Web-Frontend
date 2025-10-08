// src/pages/SuperAdminDashboard/SuperNavbar.jsx
import { FaPlus, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logo.webp";

export default function SuperNavbar({
  onBookingHistory,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 shadow-md bg-gradient-to-r from-purple-100 via-pink-50 to-white w-full">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-30 w-30" />
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-xl font-bold text-purple-700">
              SuperAdmin
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
