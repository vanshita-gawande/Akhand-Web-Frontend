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
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  // "all", "assigned", "unassigned"

  const getFirst = (...vals) => {
    for (const v of vals)
      if (v !== undefined && v !== null && v !== "") return v;
    return "";
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString("en-GB");
  };

  const computeTotalPrice = (booking) => {
    if (booking?.totalPrice != null) return booking.totalPrice;
    const pricePerSlot =
      booking.pricePerSlot ?? booking.price ?? booking.venueId?.price ?? 0;
    const slots = Array.isArray(booking.time)
      ? booking.time.length
      : booking.time
      ? 1
      : 0;
    return pricePerSlot * (slots || 1);
  };

  const q = searchTerm.trim().toLowerCase();

  const filteredBookings = bookings.filter((booking) => {
    // Apply search term filter
    const venueName = getFirst(booking.venueId?.name, booking.name).toString();
    const sport = getFirst(booking.venueId?.sport, booking.sport).toString();
    const location = getFirst(
      booking.venueId?.location,
      booking.location
    ).toString();
    const dateStr = formatDate(booking.date).toString();
    const status = (booking.status || "").toString().toLowerCase();
    const totalStr = String(computeTotalPrice(booking));

    const matchesSearch =
      !q ||
      venueName.toLowerCase().includes(q) ||
      sport.toLowerCase().includes(q) ||
      location.toLowerCase().includes(q) ||
      dateStr.toLowerCase().includes(q) ||
      status.includes(q) ||
      totalStr.includes(q);

    // Apply status filter
    const matchesStatus =
      statusFilter === "all" || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });
  const visibleBookings = showAllBookings
    ? filteredBookings
    : filteredBookings.slice(0, 3);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[85vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={() => setShowBookingHistory(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Heading + search */}
        <div className="flex flex-col items-center justify-center mb-4 gap-3 text-center">
          <h2 className="text-2xl font-extrabold mb-0 text-indigo-600 tracking-wide flex items-center gap-2">
            <FaHistory /> Your Booking History
          </h2>

          <div className="flex flex-col md:flex-row gap-3 w-full max-w-2xl">
            {/* Search Bar */}
            <div className="relative flex items-center bg-indigo-100 rounded-lg px-3 py-2 flex-1 shadow-sm">
              <FaSearch className="text-indigo-600 mr-2" />
              <input
                type="text"
                placeholder="Search by venue, sport, date, status or price..."
                className="flex-1 bg-transparent outline-none text-sm text-indigo-900 placeholder-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-indigo-100 rounded-lg px-3 py-2 shadow-sm">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none text-sm text-indigo-900 cursor-pointer"
              >
                <option value="all">All Bookings</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings list */}
        {filteredBookings.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">No bookings found.</p>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {visibleBookings.map((booking, idx) => {
                const id = booking._id ?? idx;
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
                const status = booking.status ? String(booking.status) : "N/A";
                const totalPrice = computeTotalPrice(booking);

                return (
                  <div
                    key={id}
                    className={`p-4 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50 ${
                      status === "booked"
                        ? "border-green-400"
                        : "border-red-300"
                    }`}
                  >
                    <h3 className="font-semibold text-lg text-purple-700">
                      {venueName}
                    </h3>

                    {/* Details */}
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        {/* assigned here from placeholder for search items {} in this */}
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

                    {/* Price Paid */}
                    <div className="mt-3 px-3 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded text-center w-32">
                      Price Paid: ₹{totalPrice}
                    </div>
                    {booking.qrCode && (
                      <div className="flex flex-col items-center">
                        <img
                          src={booking.qrCode}
                          alt="QR Code"
                          className="w-28 h-28 border p-1 rounded bg-white shadow"
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          Scan QR
                        </span>
                      </div>
                    )}

                    {/* Cancel Booking below Status */}
                    {status === "assigned" && (
                      <button
                        onClick={() => {
                          setBookingToCancel(booking);
                          setShowCancelPopup(true);
                        }}
                        className="mt-2 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition w-24"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Global Show More / Show Less */}
            {filteredBookings.length > 3 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllBookings((prev) => !prev)}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  {showAllBookings
                    ? "Show Less"
                    : `Show All (${filteredBookings.length})`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
