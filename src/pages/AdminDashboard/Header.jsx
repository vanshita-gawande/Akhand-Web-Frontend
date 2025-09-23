import { FaPlus, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

export default function Header({
  logo,
  onAddVenue,
  onBookingHistory,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 shadow-md bg-gradient-to-r from-purple-100 via-pink-50 to-white w-full">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Logo */}
        <img src={logo} alt="Logo" className="h-30 w-30" />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onAddVenue}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow"
          >
            <FaPlus /> Venue Registration
          </button>

          <button
            onClick={onBookingHistory}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
          >
            <FaClipboardList /> Booking History
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 border border-purple-700 text-purple-700 rounded-xl hover:bg-purple-50 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
    </header>
  );
}