import { useState } from "react";
import Overview from "./Overview";
import Users from "./CurrentUsers";
import Admins from "./Admins";
import Logs from "./Logs";
import Settings from "./Settings";

export default function SuperadminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
      case "overview": return <Overview />;
      case "users": return <Users />;
      case "admins": return <Admins />;
      case "logs": return <Logs />;
      case "settings": return <Settings />;
      default: return <Overview />;
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

      {/* Main content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
}
