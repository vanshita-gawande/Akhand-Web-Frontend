// src/pages/AdminDashboard/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getVenues,
  addVenue,
  updateVenue,
  deleteVenue,
  getAdminBookings,
} from "../../api";

// Components
import Header from "./Header";
import VenuesList from "./VenuesList";
import VenueModal from "./VenueModal";
import BookingHistory from "./BookingHistory";
import Stats from "./Stats";

// Popups
import DeletePopup from "./popups/DeletePopup";
import LogoutPopup from "./popups/LogoutPopup";
import SuccessPopup from "./popups/SuccessPopup";

// Assets
import logo from "../../assets/logo.webp";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Constants
  const initialFormData = {
    sport: "",
    name: "",
    location: "",
    capacity: "",
    date: "",
    time: "",
  };

  // State
  const [venues, setVenues] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [editingVenue, setEditingVenue] = useState(null);
  const [venueToDelete, setVenueToDelete] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);

  const [actionType, setActionType] = useState(null);

  // Helpers
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingVenue(null);
    setActionType(null);
  };

  const formatDateForDisplay = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-GB") : "";

  const toIsoDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("T")) return dateStr.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) {
      const [, d, mon, y] = m;
      return `${y}-${mon.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const parsed = new Date(dateStr);
    return !isNaN(parsed.getTime()) ? parsed.toISOString().split("T")[0] : "";
  };

  // Effects
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    getVenues()
      .then((data) =>
        setVenues(
          data.map((venue) => ({
            ...venue,
            displayDate: formatDateForDisplay(venue.date),
          }))
        )
      )
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        } else console.error(err);
      });

    getAdminBookings()
      .then(setAdminBookings)
      .catch((err) => console.error(err));
  }, [navigate]);

  // Handlers
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        date: new Date(formData.date).toISOString(),
      };

      if (editingVenue) {
        const response = await updateVenue(editingVenue._id, payload);
        const updated = response?.venue || response;
        setVenues((prev) =>
          prev.map((v) =>
            v._id === editingVenue._id
              ? { ...updated, displayDate: formatDateForDisplay(updated.date) }
              : v
          )
        );
        setActionType("update");
      } else {
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
      resetForm();
    } catch (error) {
      console.error(error);
      setActionType("error");
      setShowModal(false);
      setShowPopup(true);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      sport: venue.sport || "",
      name: venue.name || "",
      location: venue.location || "",
      capacity: venue.capacity ?? "",
      date: toIsoDate(venue.date || venue.displayDate || ""),
      time: venue.time || "",
      price: venue.price || 0,
      openingTime: venue.openingTime || "",
      closingTime: venue.closingTime || "",
    });
    setShowModal(true);
  };

  const handleDelete = (venue) => {
    setVenueToDelete(venue);
    setShowDeletePopup(true);
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

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header
        logo={logo}
        onAddVenue={() => setShowModal(true)}
        onBookingHistory={() => setShowBookingHistory(true)}
        onLogout={() => setShowLogoutPopup(true)}
      />

      <Stats />

      <main className="p-6 space-y-10">
        <VenuesList
          venues={venues}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {showModal && (
        <VenueModal
          formData={formData}
          editingVenue={editingVenue}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {showBookingHistory && (
        <BookingHistory
          bookings={adminBookings}
          onClose={() => setShowBookingHistory(false)}
        />
      )}

      {showDeletePopup && (
        <DeletePopup
          venue={venueToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}

      {showLogoutPopup && (
        <LogoutPopup
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutPopup(false)}
        />
      )}

      {showPopup && (
        <SuccessPopup
          actionType={actionType}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
