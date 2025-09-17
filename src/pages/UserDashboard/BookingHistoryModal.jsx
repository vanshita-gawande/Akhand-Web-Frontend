// src/pages/UserDashboard/BookingHistoryModal.jsx
import { useState } from "react";
import { FaTimes, FaHistory, FaSearch } from "react-icons/fa";

export default function BookingHistoryModal({
  bookings = [],
  setShowBookingHistory,
  setBookingToCancel,
  setShowCancelPopup,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  // safe helper: first valid string value
  const getFirst = (...vals) => {
    for (const v of vals) {
      if (v !== undefined && v !== null && v !== "") return v;
    }
    return "";
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString("en-GB");
  };

  const computeTotalPrice = (booking) => {
    if (booking?.totalPrice !== undefined && booking.totalPrice !== null)
      return booking.totalPrice;
    const pricePerSlot =
      booking.pricePerSlot ?? booking.price ?? booking.venueId?.price ?? 0;
    const slots = Array.isArray(booking.time)
      ? booking.time.length
      : booking.time
      ? 1
      : 0;
    // if slots is 0, fallback to pricePerSlot (so it shows something meaningful)
    return pricePerSlot * (slots || 1);
  };

  const q = searchTerm.trim().toLowerCase();

  const filteredBookings = bookings.filter((booking) => {
    if (!q) return true; // no search → keep all

    const venueName = getFirst(booking.venueId?.name, booking.name).toString();
    const sport = getFirst(booking.venueId?.sport, booking.sport).toString();
    const location = getFirst(
      booking.venueId?.location,
      booking.location
    ).toString();
    const dateStr = formatDate(booking.date).toString();
    const status = (booking.status || "").toString();
    const totalStr = String(computeTotalPrice(booking));

    return (
      venueName.toLowerCase().includes(q) ||
      sport.toLowerCase().includes(q) ||
      location.toLowerCase().includes(q) ||
      dateStr.toLowerCase().includes(q) ||
      status.toLowerCase().includes(q) ||
      totalStr.toLowerCase().includes(q)
    );
  });

  const visibleBookings = showAll
    ? filteredBookings
    : filteredBookings.slice(0, 3);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[85vh] flex flex-col">
        {/* Close button (top-right) */}
        <button
          onClick={() => setShowBookingHistory(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Close booking history"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Centered heading + search (stacked) */}
        <div className="flex flex-col items-center justify-center mb-4 gap-3 text-center">
          <h2 className="text-2xl font-extrabold mb-0 text-indigo-600 tracking-wide flex items-center gap-2">
            <FaHistory /> Your Booking History
          </h2>

          <div className="relative mb-0 flex items-center bg-indigo-100 rounded-lg px-3 py-2 w-full max-w-md shadow-sm">
            <FaSearch className="text-indigo-600 mr-2" />
            <input
              type="text"
              placeholder="Search by venue, sport, date, status or price..."
              className="flex-1 bg-transparent outline-none text-sm text-indigo-900 placeholder-indigo-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>

        {/* content */}
        {filteredBookings.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">No bookings found.</p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {visibleBookings.map((booking, idx) => {
                  const venueName =
                    getFirst(booking.venueId?.name, booking.name) ||
                    "Unknown Venue";
                  const sport =
                    getFirst(booking.venueId?.sport, booking.sport) || "N/A";
                  const location =
                    getFirst(booking.venueId?.location, booking.location) ||
                    "N/A";
                  const dateStr = formatDate(booking.date) || "Not specified";
                  const timeStr = Array.isArray(booking.time)
                    ? booking.time.join(", ")
                    : booking.time || "Flexible";
                  const players = booking.players ?? "-";
                  const status = booking.status
                    ? String(booking.status)
                    : "N/A";
                  const totalPrice = computeTotalPrice(booking);

                  return (
                    <div
                      key={booking._id ?? idx}
                      className="p-4 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50"
                    >
                      <h3 className="font-semibold text-lg text-purple-700">
                        {venueName}
                      </h3>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <strong>Sport:</strong> {sport}
                        </div>
                        <div>
                          <strong>Location:</strong> {location}
                        </div>
                        <div>
                          <strong>Date:</strong> {dateStr}
                        </div>
                        <div>
                          <strong>Time:</strong> {timeStr}
                        </div>
                        <div>
                          <strong>Players:</strong> {players}
                        </div>
                        <div
                          className={`${
                            status === "booked"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <strong>Status:</strong> {status}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="px-3 py-2 bg-green-100 text-green-800 font-semibold rounded">
                          Total Price: ₹{totalPrice}
                        </div>

                        {status === "booked" && (
                          <button
                            onClick={() => {
                              setBookingToCancel(booking);
                              setShowCancelPopup(true);
                            }}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* show more / show less */}
            {filteredBookings.length > 3 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  {showAll
                    ? "Show Less"
                    : `Show ${filteredBookings.length > 3 ? "All" : ""}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
