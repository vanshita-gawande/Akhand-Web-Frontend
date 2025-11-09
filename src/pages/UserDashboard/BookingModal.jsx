// src/pages/UserDashboard/BookingModal.jsx
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BookingModal({
  selectedVenue, // The venue the user clicked to book (contains name, price, openingTime, etc.)
  bookingForm, // Object storing form fields: { date, time, players }
  handleBookingChange, // Function to update bookingForm state
  username, // Logged-in user’s name
  sportName, // Name of the sport for the venue
  setModalOpen,
  setSelectedVenue, // Resets selected venue after booking
  userId, ///Current logged-in user’s ID
  onBookingSuccess, // below two aew callbacks function after payment
  onBookingError,
}) {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false); // for time dropdown
  const [bookedSlots, setBookedSlots] = useState([]); // stored already-booked slots
  const [isReviewStep, setIsReviewStep] = useState(false); // ✅ NEW for review before form submit
  const navigate = useNavigate();

  // Razorpay script load
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const currentSlots = Array.isArray(bookingForm.time) ? bookingForm.time : [];
  const totalPrice = (selectedVenue.price || 0) * currentSlots.length;

  // Fetch booked slots and Updates bookedSlots so those slots appear disabled.
  useEffect(() => {
    if (!selectedVenue || !bookingForm.date) return;
    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(
          `http://localhost:5002/api/bookings/venue/${selectedVenue._id}?date=${bookingForm.date}`
        );
        const data = await res.json();
        setBookedSlots(data.bookedSlots || []);
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
      }
    };
    fetchBookedSlots();
  }, [selectedVenue, bookingForm.date]);
  // adds/removes a time slot when user clicks the checkbox: prevents selcting already booked times also updtaes the parent form accordingly this booking
  const toggleTimeSelection = (slot) => {
    if (bookedSlots.includes(slot)) {
      alert(`${slot} is already booked!`);
      return;
    }
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

  // ---------------- PAYMENT HANDLER ----------------
  // Creates a Razorpay order by calling your backend /create-order.
  // Razorpay popup opens for payment.
  // On success, handler() sends payment details + booking info to backend for verification.
  // If verified → booking is stored → success callback triggers.

  const handlePayment = async () => {
    try {
      const orderResponse = await fetch(
        "http://localhost:5002/api/payments/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice }),
        }
      );
      const order = await orderResponse.json();

      const options = {
        key: "rzp_test_R9YK7209hKJDcC",
        amount: order.amount,
        currency: order.currency,
        name: "Akhand Sports",
        description: `${selectedVenue.name}, ${selectedVenue.location}\nSport: ${sportName}\nDate: ${bookingForm.date}`,
        order_id: order.id,
        handler: async function (response) {
          const bookingDetails = {
            name: username,
            date: bookingForm.date,
            time: bookingForm.time,
            players: bookingForm.players,
            venueId: selectedVenue._id,
            userId: userId,
            price: totalPrice,
          };

          const verificationResponse = await fetch(
            "http://localhost:5002/api/payments/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: bookingDetails,
              }),
            }
          );

          const result = await verificationResponse.json();
          if (result.status === "success") {
            setModalOpen(false);
            setSelectedVenue(null);
            if (onBookingSuccess) onBookingSuccess();
          } else {
            if (onBookingError) onBookingError();
          }
        },
        prefill: {
          name: username,
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment process failed:", error);
      alert("Could not initiate payment. Please try again.");
    }
  };
  // Dynamically generates hourly slots between openingTime and closingTime. bcz we are passing only closing and opening time in admin model 
  function generateTimeSlots(openingTime, closingTime, interval = 60) {
    const slots = [];
    const [openH, openM] = openingTime.split(":").map(Number);
    const [closeH, closeM] = closingTime.split(":").map(Number);

    let current = new Date(2023, 0, 1, openH, openM);
    const end = new Date(2023, 0, 1, closeH, closeM);

    while (current < end) {
      const next = new Date(current.getTime() + interval * 60000);
      const label = `${new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(current)} – ${new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(next)}`;
      slots.push(label);
      current = next;
    }
    return slots;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-black/30 z-60 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4 relative">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-indigo-600" />
          Book {selectedVenue.name}
        </h2>

        {/* ------------------- FORM STEP ------------------- */}
        {!isReviewStep && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (totalPrice <= 0) {
                alert("Please select at least one time slot.");
                return;
              }
              setIsReviewStep(true); // ✅ Go to review
            }}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={username}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </div>

            {/* Sport */}
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
                min={new Date().toISOString().split("T")[0]} // only today & future dates
              />
            </div>

            {/* Time Slots */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Time Slots
              </label>
              <div
                className="border rounded-md px-3 py-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowTimeDropdown((prev) => !prev)}
              >
                <span>
                  {currentSlots.length > 0
                    ? currentSlots.join(", ")
                    : "Select time slots"}
                </span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    showTimeDropdown ? "rotate-180" : ""
                  }`}
                />
              </div>
              {showTimeDropdown && (
                <div className="absolute mt-1 w-full max-h-28 overflow-y-auto border rounded-md bg-white shadow-lg z-10">
                  {selectedVenue.openingTime && selectedVenue.closingTime ? (
                    generateTimeSlots(
                      selectedVenue.openingTime,
                      selectedVenue.closingTime
                    ).map((slot, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                          bookedSlots.includes(slot)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={currentSlots.includes(slot)}
                          disabled={bookedSlots.includes(slot)}
                          onChange={() => toggleTimeSelection(slot)}
                          className="mr-2"
                        />
                        {slot} {bookedSlots.includes(slot) && "(Booked)"}
                      </label>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 italic">
                      No time slots available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Players */}
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

            {/* Footer */}
            <div className="flex justify-between items-center gap-3 mt-6">
              <div className="px-4 py-2 bg-green-300 text-green-800 font-semibold rounded-md">
                Price: ₹{totalPrice}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 transition-colors duration-300"
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
                  Review Booking
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ------------------- REVIEW STEP ------------------- */}
        {isReviewStep && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Review Your Booking
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Name:</strong> {username}
              </li>
              <li>
                <strong>Sport:</strong> {sportName || selectedVenue.sport}
              </li>
              <li>
                <strong>Date:</strong> {bookingForm.date}
              </li>
              <li>
                <strong>Time Slots:</strong> {currentSlots.join(", ")}
              </li>
              <li>
                <strong>Players:</strong> {bookingForm.players}
              </li>
              <li>
                <strong>Total Price:</strong> ₹{totalPrice}
              </li>
            </ul>

            <div className="flex justify-between gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                onClick={() => setIsReviewStep(false)}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={handlePayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
