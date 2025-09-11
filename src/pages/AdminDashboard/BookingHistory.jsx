import { useState } from "react";

export default function BookingHistory({ bookings, onClose }) {
  const [expandedUsers, setExpandedUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const toggleExpand = (username) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  // Group bookings by user
  const groupedBookings = Object.entries(
    bookings.reduce((acc, booking) => {
      const username =
        booking.userId?.username || booking.userId?.email || "Unknown User";
      if (!acc[username]) acc[username] = [];
      acc[username].push(booking);
      return acc;
    }, {})
  );

  // Pagination for users
  const usersPerPage = 4;
  const totalPages = Math.ceil(groupedBookings.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const visibleUsers = groupedBookings.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative max-h-[85vh] overflow-y-auto border border-gray-200">
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
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600 tracking-wide">
          Booking History
        </h2>

        {/* No bookings */}
        {bookings.length === 0 ? (
          <p className="text-gray-500 italic text-center bg-gray-50 p-4 rounded-lg shadow-sm">
            No bookings yet.
          </p>
        ) : (
          <>
            {/* User Cards */}
            {visibleUsers.map(([username, userBookings]) => {
              const isExpanded = expandedUsers[username];
              const visibleBookings = isExpanded
                ? userBookings
                : userBookings.slice(0, 2);

              return (
                <div
                  key={username}
                  className="mb-6 border rounded-xl shadow-md overflow-hidden bg-gray-50"
                >
                  {/* User Header */}
                  <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 px-4 py-3 flex justify-between items-center">
                    <span className="font-semibold text-indigo-900 text-lg">
                      {username}
                    </span>
                    <span className="text-indigo-700 text-sm font-medium">
                      {userBookings.length} bookings
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
                              {booking.userId?.username || "Unknown"}
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
                  {userBookings.length > 3 && (
                    <div className="flex justify-center py-3 bg-gray-100">
                      <button
                        onClick={() => toggleExpand(username)}
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination (numbered) */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {/* Previous */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium shadow 
                    ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                >
                  Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium shadow 
                        ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium shadow 
                    ${
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
