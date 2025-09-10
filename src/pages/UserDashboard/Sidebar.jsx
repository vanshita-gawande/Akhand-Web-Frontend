// src/pages/UserDashboard/Sidebar.jsx
import {
  FaUserCircle,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaPencilAlt,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar({
  setSidebarOpen,
  profilePicture,
  username,
  email,
  showMenu,
  setShowMenu,
  setProfilePicture,
  fetchUserBookings,
  setShowLogoutPopup,
}) {
  return (
    <div className="fixed inset-0 flex justify-end z-50">
      <div className="relative bg-white w-80 h-full shadow-lg p-6 flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={() => setSidebarOpen(false)}
        >
          <FaTimes className="text-xl" />
        </button>
        <div className="flex flex-col items-center mb-6 mt-4 pr-3">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <FaUserCircle className="text-gray-400 w-full h-full" />
              )}
            </div>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="absolute bottom-0 left-0 bg-gray-800 text-white px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 hover:bg-gray-700 shadow-md"
            >
              <FaPencilAlt className="w-3 h-3" /> Edit
            </button>

            {showMenu && (
              <div className="absolute mt-2 top-full right-0 w-40 bg-white rounded-md shadow-lg border z-10">
                <label
                  htmlFor="profile-upload"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Upload a photo
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const imageDataUrl = ev.target.result;
                        setProfilePicture(imageDataUrl);
                        localStorage.setItem("profilePicture", imageDataUrl);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                <button
                  onClick={() => {
                    setProfilePicture(null);
                    localStorage.removeItem("profilePicture");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Remove photo
                </button>
              </div>
            )}
          </div>

          <h2 className="font-bold text-xl text-gray-800">{username}</h2>
          <p className="text-sm text-gray-500">
            @{username.replace(/\s+/g, "").toLowerCase()}
          </p>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <FaCalendarAlt className="mr-2" />
            {email}
          </p>
        </div>

        <hr className="my-4" />

        <nav className="flex flex-col gap-2">
          <button className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800">
            <FaUserCircle className="mr-3 text-indigo-600" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => {
              console.log("Booking history button clicked ✅");
              fetchUserBookings();
            }}
            className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800"
          >
            <FaHistory className="mr-3 text-indigo-600" />
            <span>Booking History</span>
          </button>

          <button className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800">
            <FaCog className="mr-3 text-indigo-600" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setShowLogoutPopup(true)} // 👈 instead of directly logging out
            className="flex items-center text-left p-3 hover:bg-red-50 rounded-lg transition-colors duration-300 text-red-600 mt-4"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
