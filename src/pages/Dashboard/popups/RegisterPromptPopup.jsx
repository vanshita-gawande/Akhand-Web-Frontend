import React from "react";

export default function RegisterPromptModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) {
  if (!isOpen) return null; // don’t render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Register or Login First
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          You need to create an account or login before booking a court.
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onLogin}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Login
          </button>
          <button
            onClick={onRegister}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
