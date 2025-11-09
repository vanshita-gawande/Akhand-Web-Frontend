// src/pages/AdminDashboard/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getVenues,
  addVenue,
  updateVenue,
  deleteVenue,
  getAdminBookings,
} from "../../api"; //api function to calls backend to get or modify data(venues,boooking,etc)

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
  // Constants , default venue structure for the form 
  const initialFormData = {
    sport: "",
    name: "",
    location: "",
    capacity: "",
    date: "",
    time: "",
  };

  // State
  const [venues, setVenues] = useState([]);//hold  list of venues from backend and update 
  const [adminBookings, setAdminBookings] = useState([]);// hold booking history data
  const [formData, setFormData] = useState(initialFormData);//hold data enter in venue form
// used when edititng or deleting venue
  const [editingVenue, setEditingVenue] = useState(null);
  const [venueToDelete, setVenueToDelete] = useState(null);
// model or popup is toggeled based on thses states
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
// this decides which success message to show in the popup(eg venue added or updated)
  const [actionType, setActionType] = useState(null);

  // Helpers, it empty whatever initially add in form when submit or when editing is done
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingVenue(null);
    setActionType(null);
  };
// handle date formatting
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
    const token = localStorage.getItem("token"); // check if user has token else navigate to login page
    if (!token) return navigate("/");

    getVenues()   // fetching venues from backend
      .then((data) =>
        setVenues(
          data.map((venue) => ({
            ...venue,
            displayDate: formatDateForDisplay(venue.date),
          }))
        )
      )
      .catch((err) => { // if unauthorized token(invalid token) then logout immediately
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        } else console.error(err);
      });

    getAdminBookings()//fetch all booking history of venues managed by this admin
      .then(setAdminBookings)
      .catch((err) => console.error(err));
  }, [navigate]);

  // Handlers , removes token and user info -> redirects to home/login
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
// update state on every input change
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
// if edititng and existing venue then this will run , it opens the edit model and prefills the form with existing venue data , it runs when admin click edit button
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
        // adding new venue
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
      resetForm();// after creation reset the form
    } catch (error) {
      console.error(error);
      setActionType("error");
      setShowModal(false);
      setShowPopup(true);
    }
  };
// it send the edited data to backend when admin click the save /submit button
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
// to delte venue
  const handleDelete = (venue) => {
    setVenueToDelete(venue);
    setShowDeletePopup(true);
  };
// if admin confirms then delete from both frontend and backend
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
        onBookingHistory={() => setShowBookingHistory(true)}// is in the form of popup hence chnage the state true when click and open
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
{/* this is called conditional rendering shows model and popups conditionally only visisble when user interact */}
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
// The AdminDashboard component manages all admin operations for venue management. It uses React state for data (venues, bookings, form inputs) and multiple modals for CRUD actions. It integrates with backend APIs to fetch, create, update, and delete venues. useEffect ensures authentication by verifying a token and redirects unauthenticated users. The component provides user-friendly popups for actions, ensuring a responsive and interactive admin experience.

//What happens step-by-step when page loads

// Page opens
// useEffect checks for token
// If no token → redirect to login
// Fetch venues + bookings
// Display them
// If admin adds new venue → API call + UI update
// If admin edits venue → API call + UI update
// If admin deletes venue → API call + remove from list
// All actions show popup confirmation
// Logout clears everything + redirects home