// SuccessPopup.jsx
import React from "react";

export default function SuccessPopup({
  showPopup,
  registrationSuccess,
  handlePopupClose,
}) {
  if (!showPopup) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h3 className="text-lg font-semibold text-green-600 mb-2">
          Registration Successful
        </h3>
        <p className="text-gray-600 mb-4">
          Your account has been created successfully.
        </p>
        <button
          onClick={handlePopupClose}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          OK
        </button>
      </div>
    </div>
  );
}
