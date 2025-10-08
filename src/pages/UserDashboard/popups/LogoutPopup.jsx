import { useState } from "react";
import LogoutPopup from "../../AdminDashboard/popups/LogoutPopup";


export default function UserDashboard() {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogoutClick = () => {
    setShowLogout(true);
  };

  const handleConfirmLogout = () => {
    // Clear auth tokens
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogout(false);

    // Redirect to home page
    window.location.href = "/";
  };

  const handleClosePopup = () => {
    setShowLogout(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Example logout button */}
      <button
        onClick={handleLogoutClick}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Logout
      </button>

      {/* Logout Popup */}
      {showLogout && (
        <LogoutPopup
          onConfirm={handleConfirmLogout}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
