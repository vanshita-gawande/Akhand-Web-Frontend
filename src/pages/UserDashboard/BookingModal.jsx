// src/pages/UserDashboard/BookingModal.jsx
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <<<--- IMPORT useNavigate

export default function BookingModal({
  selectedVenue,
  bookingForm,
  handleBookingChange,
  // handleBookingSubmit,
  username,
  sportName,
  setModalOpen,
  setSelectedVenue,
  userId, // <<<--- MAKE SURE YOU PASS userId AS A PROP TO THIS COMPONENT
  onBookingSuccess, // ✅ ADD
  onBookingError, // ✅ ADD
}) {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const navigate = useNavigate(); // <<<--- INITIALIZE NAVIGATE

  // Load Razorpay script when the modal opens
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
  // Add derived price calculation
  const totalPrice = (selectedVenue.price || 0) * currentSlots.length;

  // Fetch booked slots for selected venue and date
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
  // <<<--- NEW FUNCTION TO HANDLE PAYMENT AND BOOKING ---<<<
  const handlePayment = async (e) => {
    e.preventDefault();

    if (totalPrice <= 0) {
      alert("Please select at least one time slot.");
      return;
    }

    try {
      // 1. Create Order on Backend
      const orderResponse = await fetch(
        "http://localhost:5002/api/payments/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice }),
        }
      );
      const order = await orderResponse.json();

      // 2. Configure Razorpay Options
      const options = {
        key: "rzp_test_R9YK7209hKJDcC", // <<<--- REPLACE WITH YOUR RAZORPAY KEY ID
        amount: order.amount,
        currency: order.currency,
        name: "Akhand Sports",
        description: `${selectedVenue.name}, ${selectedVenue.location}\nSport: ${sportName}\nDate: ${bookingForm.date}`,
        order_id: order.id,
        handler: async function (response) {
          // 3. This function runs on successful payment
          const bookingDetails = {
            name: username,
            date: bookingForm.date,
            time: bookingForm.time,
            players: bookingForm.players,
            venueId: selectedVenue._id,
            userId: userId, // Pass the logged-in user's ID
            price: totalPrice,
          };

          // Verify the payment on the backend
          const verificationResponse = await fetch(
            "http://localhost:5002/api/payments/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: bookingDetails, // Send all booking info for creation
              }),
            }
          );

          const result = await verificationResponse.json();

          if (result.status === "success") {
            // 4. On success, navigate to UserDashboard with a success message
            setModalOpen(false);
            setSelectedVenue(null);
            // navigate("/userdashboard", {
            //   state: { bookingStatus: "success" },
            // });
          if (onBookingSuccess) onBookingSuccess();
          } else {
            // alert("Payment verification failed. Please contact support.");
            if (onBookingError) onBookingError();
          }
        },
        prefill: {
          name: username,
        },
        theme: {
          color: "#4f46e5", // Indigo color from your button
        },
      };

      // 5. Open the Razorpay payment modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment process failed:", error);
      alert("Could not initiate payment. Please try again.");
    }
  };

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

        <form
          onSubmit={handlePayment}
          // onSubmit={(e) => {
          //   e.preventDefault(); // prevent default form reload
          //   handleBookingSubmit(e); // run your existing booking logic
          //   setModalOpen(false); // close modal
          //   setSelectedVenue(null); // reset venue
          // }}
          className="space-y-4"
        >
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

            {/* Dropdown button */}
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

            {/* Dropdown list - only visible when showTimeDropdown = true */}
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
            {/* Price Display */}
            <div className="px-4 py-2 bg-green-300 text-green-800 font-semibold rounded-md">
              Price: ₹{totalPrice}
            </div>

            <div className="flex gap-3">
              {/* Cancel */}
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
