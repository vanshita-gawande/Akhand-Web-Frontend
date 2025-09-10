export default function LogoutPopup({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Logout</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Yes, Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
