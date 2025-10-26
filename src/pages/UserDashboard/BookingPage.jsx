// src/pages/BookingPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/bookings/${id}`)
      .then((res) => setBooking(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading booking...</p>;
  if (!booking)
    return <p className="text-center mt-10 text-red-500">Booking not found</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-6 mt-10">
      <h1 className="text-3xl font-bold text-indigo-600 text-center">
        Booking Confirmation
      </h1>

      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {booking.name}
        </p>
        <p>
          <strong>Venue:</strong> {booking.venueId?.name || "N/A"}
        </p>
        <p>
          <strong>Sport:</strong> {booking.venueId?.sport || "N/A"}
        </p>
        <p>
          <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {booking.time.join(", ")}
        </p>
        <p>
          <strong>Players:</strong> {booking.players}
        </p>
        <p>
          <strong>Price Paid:</strong> ₹{booking.price}
        </p>
      </div>

      {booking.qrCode && (
        <div className="flex flex-col items-center mt-4">
          <p className="mb-2 font-medium text-gray-700">
            Scan this QR to view booking details:
          </p>
          <img
            src={booking.qrCode}
            alt="Booking QR"
            className="w-40 h-40 border-2 border-gray-200 rounded-lg p-2"
          />
        </div>
      )}

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Thank you for booking! Please save this page or QR code for entry.
        </p>
      </div>
    </div>
  );
}
