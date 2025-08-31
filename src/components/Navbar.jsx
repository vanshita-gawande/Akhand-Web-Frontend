// import logo from '../assets/logo.webp';
// import { FaSearch, FaBell, FaEnvelope } from "react-icons/fa";

// export default function Navbar({ onLoginClick, onRegisterClick, role, username, profilePicture, setSidebarOpen }) {
//   const isDashboard = role === "user" || role === "admin";

//   return (
//     <header className={isDashboard ? "bg-indigo-700 text-white shadow-md sticky top-0 z-50" : "bg-gradient-to-r from-purple-100 via-pink-50 to-white shadow-md sticky top-0 z-50"}>
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
//         {/* Brand */}
//         <div className="flex items-center space-x-2">
//           <img src={logo} alt="Akhand Logo" className="h-35 w-35" />
//         </div>

//         {isDashboard ? (
//           // Dashboard Navbar
//           <div className="flex items-center gap-6">
//             {/* Search */}
//             <div className="hidden md:flex items-center bg-indigo-600 rounded-lg px-2 py-1 w-72">
//               <FaSearch className="text-white mr-2" />
//               <input
//                 type="text"
//                 placeholder="Search matches, players..."
//                 className="flex-1 bg-transparent outline-none text-sm placeholder-gray-200 text-white"
//               />
//             </div>

//             {/* Notifications */}
//             <button className="relative">
//               <FaBell className="w-5 h-5" />
//               <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">3</span>
//             </button>

//             {/* Messages */}
//             <button className="relative">
//               <FaEnvelope className="w-5 h-5" />
//               <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">5</span>
//             </button>

//             {/* Profile */}
//             <button
//               className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
//               onClick={() => setSidebarOpen && setSidebarOpen(true)}
//             >
//               {profilePicture ? (
//                 <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 <span className="text-lg font-semibold text-white">{username?.charAt(0)}</span>
//               )}
//             </button>
//           </div>
//         ) : (
//           // Public Navbar
//           <>
//             <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
//               <li><a href="#home" className="hover:text-purple-600 cursor-pointer transition duration-300">Home</a></li>
//               <li><a href="#about" className="hover:text-purple-600 cursor-pointer transition duration-300">About</a></li>
//               <li><a href="#services" className="hover:text-purple-600 cursor-pointer transition duration-300">Services</a></li>
//               <li><a href="#footer" className="hover:text-purple-600 cursor-pointer transition duration-300">Contact</a></li>
//             </ul>

//             <div className="flex space-x-4">
//               <button className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50 transition" onClick={onLoginClick}>Login</button>
//               <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition" onClick={onRegisterClick}>Register</button>
//             </div>
//           </>
//         )}
//       </nav>
//     </header>
//   );
// }

import logo from "../assets/logo.webp";
import { FaSearch, FaBell, FaEnvelope } from "react-icons/fa";

export default function Navbar({
  onLoginClick,
  onRegisterClick,
  role,
  username,
  profilePicture,
  setSidebarOpen,
}) {
  const isDashboard = role === "user" || role === "admin";

  return (
    <header
      className={
        isDashboard
          ? "bg-indigo-700 text-white shadow-md sticky top-0 z-50"
          : "bg-gradient-to-r from-purple-100 via-pink-50 to-white shadow-md sticky top-0 z-50"
      }
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Akhand Logo" className="h-35 w-35" />
        </div>

        {isDashboard ? (
          // Dashboard Navbar
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="hidden md:flex items-center bg-indigo-600 rounded-lg px-2 py-1 w-72">
              <FaSearch className="text-white mr-2" />
              <input
                type="text"
                placeholder="Search matches, players..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-gray-200 text-white"
              />
            </div>

            {/* Notifications */}
            <button className="relative">
              <FaBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                3
              </span>
            </button>

            {/* Messages */}
            <button className="relative">
              <FaEnvelope className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                5
              </span>
            </button>

            {/* Profile */}
            <button
              className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
              onClick={() => setSidebarOpen && setSidebarOpen(true)}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-white">
                  {username?.charAt(0)}
                </span>
              )}
            </button>
          </div>
        ) : (
          // Public Navbar
          <>
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
          </>
        )}
      </nav>
    </header>
  );
}
