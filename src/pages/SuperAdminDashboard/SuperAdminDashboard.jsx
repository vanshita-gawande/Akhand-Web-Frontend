// ✅ src/pages/SuperAdminDashboard/SuperadminDashboard.jsx

import { useState } from "react";
import Overview from "./Overview";
import Users from "./CurrentUsers";
import Admins from "./Admins";
import Logs from "./Logs";
import Settings from "./Settings";
import SuperNavbar from "./SuperNavbar";
import LogoutPopup from "../AdminDashboard/popups/LogoutPopup"; // ✅ correct path

export default function SuperadminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showLogout, setShowLogout] = useState(false);

  // ✅ Logout popup open
  const handleLogoutClick = () => {
    setShowLogout(true);
  };

  // ✅ Confirm logout
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogout(false);
    window.location.href = "/";
  };

  // ✅ Cancel button closes popup
  const handleClosePopup = () => {
    setShowLogout(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ✅ Navbar */}
      <SuperNavbar onLogout={handleLogoutClick} />

      {/* ✅ Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4">
          <h2 className="font-bold text-lg mb-4">Super Admin Menu</h2>
          <ul>
            {["overview", "users", "admins", "logs", "settings"].map((tab) => (
              <li key={tab} className="mb-2">
                <button
                  className={`w-full text-left p-2 rounded transition ${
                    activeTab === tab
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-purple-50"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ✅ Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && <Overview />}
          {activeTab === "users" && <Users />}
          {activeTab === "admins" && <Admins />}
          {activeTab === "logs" && <Logs />}
          {activeTab === "settings" && <Settings />}
        </main>
      </div>

      {/* ✅ Logout Popup */}
      {showLogout && (
        <LogoutPopup
          onConfirm={handleConfirmLogout}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
