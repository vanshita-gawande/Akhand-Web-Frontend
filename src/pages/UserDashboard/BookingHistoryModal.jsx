// src/pages/UserDashboard/BookingHistoryModal.jsx
import { useState } from "react";
import { FaTimes, FaHistory } from "react-icons/fa";

export default function BookingHistoryModal({
  bookings,
  setShowBookingHistory,
  setBookingToCancel,
  setShowCancelPopup,
}) {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const bookingsPerPage = 10;
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const endIndex = startIndex + bookingsPerPage;
  const visibleBookings = showAll
    ? bookings.slice(startIndex, endIndex)
    : bookings.slice(0, 2);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setShowBookingHistory(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
          <FaHistory className="mr-2" /> Your Booking History
        </h2>

        {/* No bookings */}
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center">No bookings found.</p>
        ) : (
          <>
            {/* Outer scrollable container */}
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Inner animated container */}
              <div
                className={`transition-[max-height] duration-500 ease-in-out overflow-hidden`}
                style={{
                  maxHeight: showAll ? "2000px" : "500px", // expands smoothly
                }}
              >
                <div className="space-y-4">
                  {visibleBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="p-4 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50"
                    >
                      <h3 className="font-semibold text-lg text-purple-700">
                        {booking.venueId?.name || "Venue"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <strong>Sport:</strong>{" "}
                        {booking.venueId?.sport || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong>{" "}
                        {booking.venueId?.location || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong>{" "}
                        {new Date(booking.date).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Time:</strong> {booking.time || "Flexible"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Players:</strong> {booking.players}
                      </p>
                      <p
                        className={`text-sm font-medium mt-2 ${
                          booking.status === "booked"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Status:{" "}
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </p>

                      {/* Cancel Booking Button */}
                      {booking.status === "booked" && (
                        <button
                          onClick={() => {
                            setBookingToCancel(booking);
                            setShowCancelPopup(true);
                          }}
                          className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Show More / Show Less */}
            {bookings.length > 2 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    setShowAll(!showAll);
                    setCurrentPage(1);
                  }}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}

            {/* Pagination (only when expanded) */}
            {showAll && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                {/* Prev */}
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
