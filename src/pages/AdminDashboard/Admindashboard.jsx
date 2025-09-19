// src/pages/AdminDashboard/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getVenues,addVenue,updateVenue,deleteVenue,getAdminBookings,} from "../../api";
 // extract helpers here
import Header from "./Header";
import VenuesList from "./VenuesList";
import VenueModal from "./VenueModal";
import BookingHistory from "./BookingHistory";
import Stats from "./Stats";
// popups
import DeletePopup from "./popups/DeletePopup";
import LogoutPopup from "./popups/LogoutPopup";
import SuccessPopup from "./popups/SuccessPopup";  
// assets
import logo from "../../assets/logo.webp";


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
  const [showBookingHistory, setShowBookingHistory] = useState(false);


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
      price: venue.price || 0, // ✅ important
      openingTime: venue.openingTime || "", // ✅ include opening
      closingTime: venue.closingTime || "", // ✅ include closing
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
          onCancel={cancelDelete}
        />
      )}

      {showLogoutPopup && (
        <LogoutPopup
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutPopup(false)}
        />
      )}

      {showPopup && (
        <SuccessPopup actionType={actionType} onClose={handlePopupClose} />
      )}
    </div>
  );
}
