import { XCircle, CheckCircle } from "lucide-react";

export default function BookingPopup({ bookingStatus, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 text-center">
        <h2
          className={`text-xl font-bold mb-4 flex items-center justify-center gap-2 ${
            bookingStatus === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {bookingStatus === "error" ? (
            <>
              <XCircle className="w-6 h-6" />
              Booking Failed
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6" />
              Booking Confirmed
            </>
          )}
        </h2>

        <p className="text-gray-700">
          {bookingStatus === "error"
            ? "We couldn’t complete your booking. Please try again."
            : "Your booking has been successfully confirmed!"}
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
