import { useState, useEffect } from "react";
import { FaUsers, FaClipboardList, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getVenues, addVenue } from "../api"; // ✅ centralized API
import logo from "../assets/logo.webp";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    getVenues()
      .then((data) => {
        const formatted = data.map((venue) => ({
          ...venue,
          date: formatDateForDisplay(venue.date),
        }));
        setVenues(formatted);
      })
      .catch((err) => {
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };
      const response = await addVenue(payload);
      const newVenue = {
        ...response.venue,
        date: formatDateForDisplay(response.venue.date),
      };
      setVenues([...venues, newVenue]);
      setShowModal(false);
      setShowPopup(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to register venue.");
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setFormData(initialFormData);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData(initialFormData);
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
              onClick={handleLogout}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue._id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border-t-4 border-purple-200"
                >
                  <h3 className="text-lg font-bold text-purple-700 mb-3">
                    {venue.name}
                  </h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>
                      <strong>Sport:</strong> {venue.sport}
                    </li>
                    <li>
                      <strong>Location:</strong> {venue.location}
                    </li>
                    <li>
                      <strong>Capacity:</strong> {venue.capacity}
                    </li>
                    <li>
                      <strong>Date:</strong> {venue.date}
                    </li>
                    <li>
                      <strong>Time:</strong> {venue.time}
                    </li>
                  </ul>
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
                className="w-full bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition"
              >
                Register Venue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 text-center">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              ✅ Success!
            </h2>
            <p className="text-gray-700">Venue registered successfully.</p>
            <button
              onClick={handlePopupClose}
              className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
