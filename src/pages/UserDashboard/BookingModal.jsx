// src/pages/UserDashboard/BookingModal.jsx
import {  FaCalendarAlt } from "react-icons/fa";

export default function BookingModal({
  selectedVenue,
  bookingForm,
  handleBookingChange,
  handleBookingSubmit,
  username,
  setModalOpen,
  setSelectedVenue,
}) {
  return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" />
              Book {selectedVenue.name}
            </h2>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={username}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  name="time"
                  type="time"
                  value={bookingForm.time}
                  onChange={handleBookingChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default: {selectedVenue.time || "flexible"}
                </p>
              </div>

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

              <div className="flex justify-end gap-3 mt-6">
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
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
  );
}
