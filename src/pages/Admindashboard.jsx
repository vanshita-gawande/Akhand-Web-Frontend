import { useState, useEffect } from "react";
import { FaUsers, FaClipboardList, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getVenues, addVenue, updateVenue, deleteVenue,getAdminBookings} from "../api";
import {Pencil,Trash2,Trophy,MapPin,Users,CalendarDays,Clock,} from "lucide-react";
import logo from "../assets/logo.webp";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [actionType, setActionType] = useState(null); // "create" | "update" | null
  // For Delete Confirmation Popup
  const [showDeletePopup, setShowDeletePopup] = useState(false); // controls visibility
  const [venueToDelete, setVenueToDelete] = useState(null); // stores the venue selected for deletion
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [adminBookings, setAdminBookings] = useState([]);

  const initialFormData = {
    sport: "",
    name: "",
    location: "",
    capacity: "",
    date: "",
    time: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  // Helper: safely convert various date strings -> yyyy-mm-dd (for <input type="date">)
  const toIsoDate = (dateStr) => {
    if (!dateStr) return "";
    // already ISO with T
    if (dateStr.includes("T")) return dateStr.split("T")[0];
    // already yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // dd/mm/yyyy -> convert to yyyy-mm-dd
    const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
      const [, d, mon, y] = m;
      return `${y}-${mon.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    // try Date parsing fallback (avoid calling toISOString on invalid Date)
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }
    return "";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    getVenues()
      .then((data) => {
        // Keep original date (ISO) and add displayDate for UI
        const formatted = data.map((venue) => ({
          ...venue,
          displayDate: formatDateForDisplay(venue.date),
        }));
        setVenues(formatted);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.error(err);
        }
      });
  }, [navigate]);
  // Fetch bookings for admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getAdminBookings()
      .then((data) => setAdminBookings(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        date: new Date(formData.date).toISOString(), // date input is yyyy-mm-dd -> safe to convert
      };

      if (editingVenue) {
        // Update
        const response = await updateVenue(editingVenue._id, payload);
        const updated = response?.venue || response; // handle both shapes
        setVenues((prev) =>
          prev.map((v) =>
            v._id === editingVenue._id
              ? { ...updated, displayDate: formatDateForDisplay(updated.date) }
              : v
          )
        );
        setActionType("update");
      } else {
        // Create
        const response = await addVenue(payload);
        const created = response?.venue || response;
        setVenues((prev) => [
          ...prev,
          { ...created, displayDate: formatDateForDisplay(created.date) },
        ]);
        setActionType("create");
      }

      setShowModal(false);
      setShowPopup(true);
      setEditingVenue(null);
      setFormData(initialFormData);
    } catch (error) {
      console.error(error);
      setActionType("error"); // 🔥 mark as error
      setShowModal(false);
      setShowPopup(true);
    }
  };

  const handleEdit = (venue) => {
    // store selected venue and prepare the form safely
    setEditingVenue(venue);
    const isoDate = toIsoDate(venue.date || venue.displayDate || "");
    setFormData({
      sport: venue.sport || "",
      name: venue.name || "",
      location: venue.location || "",
      capacity: venue.capacity ?? "",
      date: isoDate,
      time: venue.time || "",
    });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!venueToDelete) return;

    try {
      await deleteVenue(venueToDelete._id);
      setVenues((prev) => prev.filter((v) => v._id !== venueToDelete._id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete venue.");
    } finally {
      setShowDeletePopup(false);
      setVenueToDelete(null);
    }
  };


  const cancelDelete = () => {
    setShowDeletePopup(false);
    setVenueToDelete(null);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setFormData(initialFormData);
    setEditingVenue(null);
    setActionType(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setEditingVenue(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <header className="sticky top-0 z-40 shadow-md bg-gradient-to-r from-purple-100 via-pink-50 to-white w-full">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          {/* Logo */}
          <img src={logo} alt="Logo" className="h-30 w-30" />

          {/* Center: Title */}
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow"
            >
              <FaPlus /> Venue Registration
            </button>

            <button
              onClick={() => setShowBookingHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow"
            >
              <FaClipboardList /> Booking History
            </button>

            <button
              onClick={() => setShowLogoutPopup(true)}
              className="flex items-center gap-2 px-4 py-2 border border-purple-700 text-purple-700 rounded-xl hover:bg-purple-50 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="p-6 space-y-10">
        {/* Stats */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
              <FaUsers className="text-4xl text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Users
                </h3>
                <p className="text-gray-600">120</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
              <FaClipboardList className="text-4xl text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Active Sessions
                </h3>
                <p className="text-gray-600">15</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
              <FaUsers className="text-4xl text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Admins</h3>
                <p className="text-gray-600">3</p>
              </div>
            </div>
          </div>
        </section>

        {/* Venues */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Registered Venues
          </h2>
          {venues.length === 0 ? (
            <p className="text-gray-600 italic">No venues registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-t-2xl border-b border-gray-200">
                    <h3 className="text-lg font-bold text-purple-700 tracking-wide">
                      {venue.name}
                    </h3>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 flex-1 space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <Trophy size={16} className="text-purple-600" />
                      <span>
                        <strong>Sport:</strong> {venue.sport}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-red-500" />
                      <span>
                        <strong>Location:</strong> {venue.location}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Users size={16} className="text-green-600" />
                      <span>
                        <strong>Capacity:</strong> {venue.capacity}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-blue-600" />
                      <span>
                        <strong>Date:</strong> {venue.displayDate}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-500" />
                      <span>
                        <strong>Time:</strong> {venue.time}
                      </span>
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex justify-end gap-3 px-3 py-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(venue)}
                      className="p-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition shadow-sm"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setVenueToDelete(venue);
                        setShowDeletePopup(true);
                      }}
                      className="p-2 rounded-full border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
            <button
              onClick={handleModalClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
              Venue Registration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                placeholder="Sport (e.g. Football, Basketball)"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Venue Name"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <button
                type="submit"
                className={`w-full p-3 rounded-xl text-white transition ${
                  editingVenue
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {editingVenue ? "Update Venue" : "Register Venue"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* booking history */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Booking History
        </h2>

        {adminBookings.length === 0 ? (
          <p className="text-gray-600 italic">No bookings yet.</p>
        ) : (
          <div className="space-y-6">
            {adminBookings.map(({ user, bookings, count }) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition"
              >
                {/* User Info */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-purple-700">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600 font-medium">
                      Total Bookings:{" "}
                    </span>
                    <span className="text-purple-600 font-bold">{count}</span>
                  </div>
                </div>

                {/* Bookings List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {bookings.map((b) => (
                    <div
                      key={b._id}
                      className="bg-purple-50 p-3 rounded-xl border border-purple-100 hover:bg-purple-100 transition"
                    >
                      <p className="font-semibold text-purple-700">{b.name}</p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Sport:</span>{" "}
                        {b.sport || "-"}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(b.date).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Time:</span> {b.time}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Players:</span>{" "}
                        {b.players}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              ⚠️ Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the venue{" "}
              <strong>{venueToDelete?.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 text-center">
            <h2
              className={`text-xl font-bold mb-4 ${
                actionType === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {actionType === "error" ? "❌ Error!" : "✅ Success!"}
            </h2>
            <p className="text-gray-700">
              {actionType === "create" && "Venue registered successfully."}
              {actionType === "update" && "Venue updated successfully."}
              {actionType === "delete" && "Venue deleted successfully."}
              {actionType === "error" &&
                "Failed to perform the action. Please try again."}
            </p>

            <button
              onClick={handlePopupClose}
              className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
