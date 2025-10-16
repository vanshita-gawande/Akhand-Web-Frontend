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

  // ✅ Tabs configuration
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "admins", label: "Admins" },
    { id: "logs", label: "Logs" },
    { id: "settings", label: "Settings" },
  ];

  const handleLogout = async () => {
    try {
      // Call backend API to logout
      await fetch("/api/logout", { method: "POST", credentials: "include" });

      // Clear any tokens stored locally (if using JWT)
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "users":
        return <Users />;
      case "admins":
        return <Admins />;
      case "logs":
        return <Logs />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Super Admin</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="block w-full mt-6 text-left px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>

      </aside>

      {/* ✅ Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Super Admin Menu
          </h2>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-purple-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ✅ Main Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
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
