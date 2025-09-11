// src/pages/UserDashboard/BookingModal.jsx
import { useState } from "react";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";

export default function BookingModal({
  selectedVenue,
  bookingForm,
  handleBookingChange,
  handleBookingSubmit,
  username,
  sportName,
  setModalOpen,
  setSelectedVenue,
}) {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Ensure bookingForm.time is always an array
  const currentSlots = Array.isArray(bookingForm.time) ? bookingForm.time : [];

  const toggleTimeSelection = (slot) => {
    if (currentSlots.includes(slot)) {
      handleBookingChange({
        target: { name: "time", value: currentSlots.filter((s) => s !== slot) },
      });
    } else {
      handleBookingChange({
        target: { name: "time", value: [...currentSlots, slot] },
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-black/30 z-60 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4 relative">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-indigo-600" />
          Book {selectedVenue.name}
        </h2>

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          {/* Sport Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Sport</label>
            <input
              type="text"
              value={sportName || selectedVenue.sport || ""}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              name="date"
              type="date"
              value={bookingForm.date}
              onChange={handleBookingChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {/* Time Slots Multi-Select Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Time Slots</label>
            <div
              className="border rounded-md px-3 py-2 flex justify-between items-center cursor-pointer"
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            >
              <span>
                {currentSlots.length > 0
                  ? currentSlots.join(", ")
                  : "Select time slots"}
              </span>
              <FaChevronDown />
            </div>

            {showTimeDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                {selectedVenue.availableTimes?.map((slot, idx) => (
                  <label
                    key={idx}
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={currentSlots.includes(slot)}
                      onChange={() => toggleTimeSelection(slot)}
                      className="mr-2"
                    />
                    {slot}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Number of Players */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Players
            </label>
            <input
              name="players"
              type="number"
              min="1"
              max={selectedVenue.capacity || 20}
              value={bookingForm.players}
              onChange={handleBookingChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center gap-3 mt-6">
            {/* Price Button */}
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
              onClick={() => alert(`Price: ${selectedVenue.price || "N/A"}`)}
            >
              Price
            </button>

            <div className="flex gap-3">
              {/* Cancel */}
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedVenue(null);
                }}
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
