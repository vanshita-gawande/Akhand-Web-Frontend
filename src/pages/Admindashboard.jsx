import { useState, useEffect } from "react";
import { FaUsers, FaClipboardList, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getVenues, addVenue } from "../api"; // ✅ use centralized API

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    sport: "",
    venueName: "",
    location: "",
    capacity: "",
    date: "",
    time: "",
  });

  // ✅ Fetch venues on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login...");
      navigate("/");
      return;
    }

    getVenues()
      .then((data) => setVenues(data))
      .catch((err) => {
        console.error("Error fetching venues:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Add venue using api.js
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newVenue = await addVenue(formData);
      setVenues([...venues, newVenue]); // update UI
      setShowModal(false); // close modal after success
    } catch (error) {
      console.error("Error registering venue:", error);
      alert(error.response?.data?.message || "Failed to register venue.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            <FaPlus /> Venue Registration
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
          <FaUsers className="text-3xl text-blue-500" />
          <div>
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-gray-600">120</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
          <FaClipboardList className="text-3xl text-green-500" />
          <div>
            <h2 className="text-lg font-semibold">Active Sessions</h2>
            <p className="text-gray-600">15</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
          <FaUsers className="text-3xl text-purple-500" />
          <div>
            <h2 className="text-lg font-semibold">Admins</h2>
            <p className="text-gray-600">3</p>
          </div>
        </div>
      </section>

      {/* Venue Cards */}
      <section>
        <h2 className="text-xl font-bold mb-4">Registered Venues</h2>
        {venues.length === 0 ? (
          <p className="text-gray-600">No venues registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {venue.venueName}
                </h3>
                <p className="text-gray-600">
                  <strong>Sport:</strong> {venue.sport}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {venue.location}
                </p>
                <p className="text-gray-600">
                  <strong>Capacity:</strong> {venue.capacity}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {venue.date}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong> {venue.time}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Venue Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Venue Registration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                placeholder="Sport (e.g. Football, Basketball)"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="Venue Name"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition"
              >
                Register Venue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
