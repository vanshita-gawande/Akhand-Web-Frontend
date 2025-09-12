import { XCircle, CheckCircle } from "lucide-react";

export default function SuccessPopup({ actionType, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {actionType === "error" ? (
            <XCircle className="w-12 h-12 text-red-600" />
          ) : (
            <CheckCircle className="w-12 h-12 text-green-600" />
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-xl font-bold mb-2 ${
            actionType === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {actionType === "error" ? "Error!" : "Success!"}
        </h2>

        {/* Message */}
        <p className="text-gray-700">
          {actionType === "create" && "Venue registered successfully."}
          {actionType === "update" && "Venue updated successfully."}
          {actionType === "delete" && "Venue deleted successfully."}
          {actionType === "error" &&
            "Failed to perform the action. Please try again."}
        </p>

        {/* OK Button */}
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
