// src/pages/UserDashboard/BookingHistoryModal.jsx
import { FaTimes, FaHistory } from "react-icons/fa";

export default function BookingHistoryModal({
  bookings,
  setShowBookingHistory,
  setBookingToCancel,
  setShowCancelPopup,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={() => setShowBookingHistory(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
          <FaHistory className="mr-2" /> Your Booking History
        </h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center">No bookings found.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <h3 className="font-semibold text-lg text-purple-700">
                  {booking.venueId?.name || "Venue"}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Sport:</strong> {booking.venueId?.sport || "N/A"}
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
        )}
      </div>
    </div>
  );
}
