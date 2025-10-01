import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

export default function CancelPopup({ onConfirm, onClose }) {
  const [agreed, setAgreed] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = () => {
    setIsCancelling(true); // show spinner
    // simulate delay
    setTimeout(() => {
      setIsCancelling(false);
      onConfirm(); // trigger actual cancel logic
    }, 2500); // 2.5 seconds delay
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md text-center space-y-6">
        {/* Warning Icon */}
        <FaExclamationTriangle className="mx-auto text-yellow-500 text-3xl" />

        {/* Heading */}
        <h3 className="text-xl font-bold text-gray-800">Cancel Booking?</h3>

        {/* Description */}
        <p className="text-gray-700 text-sm">
          Are you sure you want to cancel this booking? Please review the terms
          below.
        </p>

        {/* Terms Box */}
        <div className="text-left border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-2">
          <p className="font-semibold text-gray-800 mb-1">
            Cancellation Terms & Conditions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
            <li>Cancellations must be made at least 24 hours in advance.</li>
            <li>Refunds will be processed within 3-5 business days.</li>
            <li>No refund for late cancellations or no-shows.</li>
            <li>The venue may have additional specific policies.</li>
            <li>All cancellations are subject to approval by management.</li>
            <li>
              By checking the box below, you agree to abide by these terms.
            </li>
          </ul>
        </div>

        {/* Checkbox */}
        <div className="text-left">
          <label className="inline-flex items-center text-gray-800 text-sm">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={isCancelling}
            />
            <span className="ml-2 font-medium text-sm">
              I have read and agree to the <strong>cancellation terms</strong>
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={onClose}
            disabled={isCancelling}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              isCancelling
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            No, Go Back
          </button>

          <button
            onClick={handleCancel}
            disabled={!agreed || isCancelling}
            className={`px-5 py-2 rounded-lg font-semibold text-white transition ${
              agreed && !isCancelling
                ? "bg-red-500 hover:bg-red-600"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            {isCancelling ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Cancelling...
              </div>
            ) : (
              "Yes, Cancel"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
