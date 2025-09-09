// src/pages/UserDashboard/Header.jsx
import { FaBell, FaEnvelope, FaSearch } from "react-icons/fa";

export default function Header({
  logo,
  profilePicture,
  username,
  setSidebarOpen,
}) {
  return (
     <header className="sticky top-0 z-40 shadow-md bg-gradient-to-r from-purple-100 via-pink-50 to-white">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
              <img src={logo} alt="Logo" className="h-30 w-30" />
    
              <div className="hidden md:flex items-center bg-purple-200 rounded-lg px-2 py-1 w-72">
                <FaSearch className="text-purple-700 mr-2" />
                <input
                  type="text"
                  placeholder="Search matches, players..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder-purple-600 text-purple-800"
                />
              </div>
    
              <div className="flex items-center gap-6">
                <button className="relative text-gray-700 hover:text-purple-700">
                  <FaBell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                    3
                  </span>
                </button>
    
                <button className="relative text-gray-700 hover:text-purple-700">
                  <FaEnvelope className="w-5 h-5" />
                  <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                    5
                  </span>
                </button>
    
                <button
                  className="w-11 h-11 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
                  onClick={() => setSidebarOpen(true)}
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-white">
                      {username.charAt(0)}
                    </span>
                  )}
                </button>
              </div>
            </nav>
          </header>
  );
}
