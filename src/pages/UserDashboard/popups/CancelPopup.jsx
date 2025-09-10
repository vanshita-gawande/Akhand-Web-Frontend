import { FaExclamationTriangle } from "react-icons/fa";

export default function CancelPopup({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
        <FaExclamationTriangle className="mx-auto text-yellow-500 text-4xl mb-3" />
        <h3 className="text-lg font-bold">Cancel Booking?</h3>
        <p className="text-gray-600 mt-2">
          Are you sure you want to cancel this booking?
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            No, Go Back
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


// export default function CancelPopup({ booking, onConfirm, onClose }) {
//   if (!booking) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//       <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
//         <h3 className="text-lg font-bold text-gray-800 mb-4">
//           Confirm Cancellation
//         </h3>
//         <p className="text-sm text-gray-600 mb-6">
//           Are you sure you want to cancel your booking for{" "}
//           <strong>{booking.venueId?.name}</strong> on{" "}
//           {new Date(booking.date).toLocaleDateString("en-GB")}?
//         </p>
//         <div className="flex justify-center gap-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
//           >
//             No
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
//           >
//             Yes, Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
