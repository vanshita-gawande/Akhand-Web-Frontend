import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function BookingHistory({ bookings, onClose }) {
  const [expandedUsers, setExpandedUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Group bookings by user
  const groupedBookings = Object.entries(
    bookings.reduce((acc, booking) => {
      const displayName =
        (booking.userId?.firstName
          ? `${booking.userId.firstName} ${booking.userId.lastName || ""}`
          : booking.userId?.email) || "Unknown User";

      if (!acc[displayName])
        acc[displayName] = { user: booking.userId, bookings: [] };
      acc[displayName].bookings.push(booking);
      return acc;
    }, {})
  );

  // 🔍 Filtered results based on search
  const filteredBookings = groupedBookings.filter(([userId, data]) => {
    const username = data.user?.firstName
      ? `${data.user.firstName} ${data.user.lastName || ""}`.toLowerCase()
      : "";
    const email = data.user?.email?.toLowerCase() || "";
    const venues = data.bookings
      .map((b) => b.venueId?.name?.toLowerCase() || "")
      .join(" ");

    return (
      username.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      venues.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination for users
  const usersPerPage = 4;
  const totalPages = Math.ceil(filteredBookings.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const visibleUsers = filteredBookings.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative max-h-[85vh] overflow-y-auto border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center 
             rounded-full bg-indigo-100 text-indigo-600 font-bold 
             hover:bg-indigo-200 hover:text-red-500 transition duration-200 shadow-sm"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-extrabold mb-6 text-center text-indigo-500 tracking-wide">
          Booking History
        </h2>

        {/* Search Bar */}
        <div className="relative mb-6 flex items-center bg-indigo-100 rounded-lg px-3 py-2 w-full max-w-md mx-auto shadow-sm">
          <FaSearch className="text-indigo-600 mr-2" />
          <input
            type="text"
            placeholder="Search by username, email, or venue..."
            className="flex-1 bg-transparent outline-none text-sm text-indigo-900 placeholder-indigo-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page after new search
            }}
          />
        </div>

        {/* No bookings */}
        {bookings.length === 0 ? (
          <p className="text-gray-500 italic text-center bg-gray-50 p-4 rounded-lg shadow-sm">
            No bookings yet.
          </p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-gray-500 italic text-center bg-gray-50 p-4 rounded-lg shadow-sm">
            No results found for "{searchTerm}"
          </p>
        ) : (
          <>
            {/* User Cards */}
            {visibleUsers.map(([userId, data]) => {
              const isExpanded = expandedUsers[userId];
              const visibleBookings = isExpanded
                ? data.bookings
                : data.bookings.slice(0, 2);

              return (
                <div
                  key={userId}
                  className="mb-6 border rounded-xl shadow-md overflow-hidden bg-gray-50"
                >
                  {/* User Header */}
                  <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 px-4 py-3 flex justify-between items-center">
                    <span className="font-semibold text-indigo-900 text-lg">
                      {userId || "Unknown User"}
                    </span>
                    <span className="text-indigo-700 text-sm font-medium">
                      {data.bookings.length} bookings
                    </span>
                  </div>

                  {/* Table */}
                  <div
                    className={`transition-[max-height] duration-500 ease-in-out overflow-hidden`}
                    style={{
                      maxHeight: isExpanded ? "500px" : "220px",
                    }}
                  >
                    <table className="w-full text-sm text-left border-separate border-spacing-0">
                      <thead className="sticky top-0 bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-md border-b-2 border-black z-10">
                        <tr className="text-white uppercase text-xs font-bold tracking-wide">
                          <th className="px-4 py-2">Username</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Venue</th>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Time</th>
                          <th className="px-4 py-2">Players</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleBookings.map((booking, index) => (
                          <tr
                            key={booking._id}
                            className={`border-b ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-indigo-50 transition-colors`}
                          >
                            <td className="px-4 py-3 font-medium text-gray-800">
                              {booking.userId?.firstName
                                ? `${booking.userId.firstName} ${
                                    booking.userId.lastName || ""
                                  }`
                                : booking.userId?.email || "Unknown User"}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {booking.userId?.email || "Unknown"}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {booking.venueId?.name || "Unknown Venue"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {booking.date
                                ? new Date(booking.date).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "Unknown"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {booking.time || "Unknown"}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {booking.players || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Toggle Button */}
                  {data.bookings.length > 3 && (
                    <div className="flex justify-center py-3 bg-gray-100">
                      <button
                        onClick={() => toggleExpand(userId)}
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium shadow ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium shadow ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium shadow ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
