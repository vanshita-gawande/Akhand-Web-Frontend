import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear any auth state here if needed
    navigate("/"); // redirect to homepage
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Welcome, User 👋
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Profile</h3>
            <p className="text-gray-600">
              View and update your profile details.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Orders</h3>
            <p className="text-gray-600">
              Check your recent activities and history.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600">
              Manage your preferences and account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
