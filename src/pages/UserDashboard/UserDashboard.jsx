// // src/pages/UserDashboard/UserDashboard.jsx
// import { useState, useEffect, useRef } from "react";
// import logo from "../../assets/logo.webp";
// import {
//   FaBasketballBall,
//   FaTableTennis,
//   FaFutbol,
//   FaVolleyballBall,
//   FaRunning,
//   FaSwimmer,
//   FaBiking,
//   FaBaseballBall,
// } from "react-icons/fa";
// import { GiCricketBat, GiTennisRacket, GiHockey } from "react-icons/gi";
// import {
//   getVenues,
//   bookVenue,
//   getUserBookings,
//   cancelBooking,
// } from "../../api";

// // child components
// import Header from "./Header";
// import Welcome from "./Welcome";
// import VenuesGrid from "./VenuesGrid";
// import Sidebar from "./Sidebar";
// import BookingModal from "./BookingModal";
// import BookingHistoryModal from "./BookingHistoryModal";

// // popups
// import LogoutPopup from "./popups/LogoutPopup";
// import BookingPopup from "./popups/BookingPopup";
// import CancelPopup from "./popups/CancelPopup";

// export default function UserDashboard() {
//   //State is data that a component owns and can change over time. and can use for Example: opening/closing sidebar, booking modals, dropdown menus.
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [venues, setVenues] = useState([]);
//   const [selectedVenue, setSelectedVenue] = useState(null);
//   const [bookingForm, setBookingForm] = useState({
//     date: "",
//     time: "",
//     players: 1,
//   });
//   const [username, setUsername] = useState("Guest");
//   const [email, setEmail] = useState("user@example.com");
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const gamesRef = useRef(null);
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false);
//   const [showBookingPopup, setShowBookingPopup] = useState(false);
//   const [bookingStatus, setBookingStatus] = useState(null);
//   const [showBookingHistory, setShowBookingHistory] = useState(false);
//   const [bookings, setBookings] = useState([]);
//   const [bookingToCancel, setBookingToCancel] = useState(null);
//   const [showCancelPopup, setShowCancelPopup] = useState(false);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     // ✅ Get the full user object if available
//     const userString = localStorage.getItem("user");
//     let storedUserId = null;

//     if (userString) {
//       const userData = JSON.parse(userString);
//       storedUserId = userData._id; // ✅ Extract _id for backend
//       if (storedUserId) setUserId(storedUserId);
//     }

//     // ✅ Continue using your existing working logic
//     const storedUsername = localStorage.getItem("username");
//     const storedEmail = localStorage.getItem("email");
//     const storedProfilePic = localStorage.getItem("profilePicture");

//     if (storedUsername) setUsername(storedUsername);
//     if (storedEmail) setEmail(storedEmail);
//     if (storedProfilePic) setProfilePicture(storedProfilePic);

//     fetchVenues();
//   }, []);

//   //fine
//   const fetchVenues = async () => {
//     try {
//       const data = await getVenues();
//       const formatted = data.map((v) => ({
//         ...v,
//         date: v.date ? new Date(v.date).toLocaleDateString("en-GB") : "",
//       }));
//       setVenues(formatted);
//     } catch (err) {
//       console.error("Failed to load venues:", err);
//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         window.location.href = "/";
//       }
//     }
//   };

//   // 
//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   const scrollToGames = () => {
//     gamesRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const openBookingForm = (venue) => {
//     setSelectedVenue(venue);
//     setBookingForm({
//       date: "",
//       time: venue.time || "",
//       players: 1,
//     });
//     setModalOpen(true);
//   };

//   const handleBookingChange = (e) => {
//     setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
//   };

//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedVenue) return;

//     const payload = {
//       name: selectedVenue.name,
//       date: bookingForm.date ? new Date(bookingForm.date) : null,
//       time: bookingForm.time,
//       players: Number(bookingForm.players),
//       venueId: selectedVenue._id,
//       pricePerSlot: selectedVenue.price || 0,
//       // totalPrice: (selectedVenue.price || 0) * Number(bookingForm.players), -- alreday in backend it is saving it as price variable
//     };

//     try {
//       const res = await bookVenue(payload);
//       console.log("Booking response:", res);

//       // ✅ Success state
//       setBookingStatus("success");
//       setShowBookingPopup(true);

//       // Reset/close modal
//       setModalOpen(false);
//       setSelectedVenue(null);
//     } catch (err) {
//       console.error("Booking failed:", err);

//       // ❌ Error state
//       setBookingStatus("error");
//       setShowBookingPopup(true);
//     }
//   };

//   const fetchUserBookings = async () => {
//     try {
//       const data = await getUserBookings();
//       setBookings(data);
//       setShowBookingHistory(true);
//     } catch (err) {
//       console.error("Failed to load booking history:", err);
//     }
//   };

//   const handleCancelBooking = async () => {
//     if (!bookingToCancel) return;
//     try {
//       await cancelBooking(bookingToCancel._id);
//       setBookings(bookings.filter((b) => b._id !== bookingToCancel._id));
//       setShowCancelPopup(false);
//       setBookingToCancel(null);
//     } catch (err) {
//       console.error("Failed to cancel booking:", err);
//       alert("Failed to cancel booking. Please try again.");
//     }
//   };

//   const sportIcon = (sport) => {
//     if (!sport) return <FaFutbol className="text-xl" />;
//     const s = sport.toLowerCase();

//     if (s.includes("football") || s.includes("soccer"))
//       return <FaFutbol className="text-xl" />;
//     if (s.includes("basket")) return <FaBasketballBall className="text-xl" />;
//     if (s.includes("tennis") && !s.includes("table"))
//       return <GiTennisRacket className="text-xl" />;
//     if (s.includes("table tennis") || s.includes("ping"))
//       return <FaTableTennis className="text-xl" />;
//     if (s.includes("badminton")) return <GiTennisRacket className="text-xl" />;
//     if (s.includes("cricket")) return <GiCricketBat className="text-xl" />;
//     if (s.includes("hockey")) return <GiHockey className="text-xl" />;
//     if (s.includes("volley")) return <FaVolleyballBall className="text-xl" />;
//     if (s.includes("swim")) return <FaSwimmer className="text-xl" />;
//     if (s.includes("run")) return <FaRunning className="text-xl" />;
//     if (s.includes("cycle")) return <FaBiking className="text-xl" />;
//     if (s.includes("baseball")) return <FaBaseballBall className="text-xl" />;

//     return <FaFutbol className="text-xl" />;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header
//         logo={logo}
//         profilePicture={profilePicture}
//         username={username}
//         setSidebarOpen={setSidebarOpen}
//         venues={venues}
//       />

//       <Welcome username={username} scrollToGames={scrollToGames} />

//       <VenuesGrid
//         venues={venues}
//         sportIcon={sportIcon}
//         openBookingForm={openBookingForm}
//         gamesRef={gamesRef}
//       />

//       {sidebarOpen && (
//         <Sidebar
//           sidebarOpen={sidebarOpen} // add this prop
//           setSidebarOpen={setSidebarOpen}
//           profilePicture={profilePicture}
//           username={username}
//           email={email}
//           showMenu={showMenu}
//           setShowMenu={setShowMenu}
//           setProfilePicture={setProfilePicture}
//           fetchUserBookings={fetchUserBookings}
//           setShowLogoutPopup={setShowLogoutPopup}
//         />
//       )}

//       {modalOpen && selectedVenue && (
//         <BookingModal
//           selectedVenue={selectedVenue}
//           bookingForm={bookingForm}
//           handleBookingChange={handleBookingChange}
//           username={username}
//           userId={userId} // ✅ pass userId here
//           setModalOpen={setModalOpen}
//           setSelectedVenue={setSelectedVenue}
//           onBookingSuccess={() => {
//             setBookingStatus("success"); // show success popup
//             setShowBookingPopup(true);
//           }}
//           onBookingError={() => {
//             setBookingStatus("error"); // show error popup
//             setShowBookingPopup(true);
//           }}
//         />
//       )}

//       {showBookingHistory && (
//         <BookingHistoryModal
//           bookings={bookings}
//           setShowBookingHistory={setShowBookingHistory}
//           setBookingToCancel={setBookingToCancel}
//           setShowCancelPopup={setShowCancelPopup}
//         />
//       )}

//       {/* popups */}
//       {showLogoutPopup && (
//         <LogoutPopup
//           onConfirm={handleLogout}
//           onClose={() => setShowLogoutPopup(false)}
//         />
//       )}

//       {bookingStatus && (
//         <BookingPopup
//           bookingStatus={bookingStatus}
//           onClose={() => setBookingStatus(null)}
//         />
//       )}

//       {showCancelPopup && bookingToCancel && (
//         <CancelPopup
//           booking={bookingToCancel}
//           onConfirm={handleCancelBooking}
//           onClose={() => setShowCancelPopup(false)}
//         />
//       )}
//     </div>
//   );
// }

// src/pages/UserDashboard/UserDashboard.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import logo from "../../assets/logo.webp";
import {
  FaBasketballBall, FaTableTennis, FaFutbol, FaVolleyballBall,
  FaRunning, FaSwimmer, FaBiking, FaBaseballBall
} from "react-icons/fa";
import { GiCricketBat, GiTennisRacket, GiHockey } from "react-icons/gi";
import { getVenues, bookVenue, getUserBookings, cancelBooking } from "../../api";

// child components
import Header from "./Header";
import Welcome from "./Welcome";
import VenuesGrid from "./VenuesGrid";
import Sidebar from "./Sidebar";
import BookingModal from "./BookingModal";
import BookingHistoryModal from "./BookingHistoryModal";

// popups
import LogoutPopup from "./popups/LogoutPopup";
import BookingPopup from "./popups/BookingPopup";
import CancelPopup from "./popups/CancelPopup";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [bookingForm, setBookingForm] = useState({ date: "", time: "", players: 1 });
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("user@example.com");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [userId, setUserId] = useState(null);

  const gamesRef = useRef(null);

  // ✅ Initialize user from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData._id) setUserId(userData._id);
    setUsername(localStorage.getItem("username") || "Guest");
    setEmail(localStorage.getItem("email") || "user@example.com");
    setProfilePicture(localStorage.getItem("profilePicture") || null);
    fetchVenues();
  }, []);

  // ✅ Fetch Venues
  const fetchVenues = useCallback(async () => {
    try {
      const data = await getVenues();
      setVenues(
        data.map((v) => ({
          ...v,
          date: v.date ? new Date(v.date).toLocaleDateString("en-GB") : "",
        }))
      );
    } catch (err) {
      console.error("Failed to load venues:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ✅ Scroll to games section
  const scrollToGames = () => gamesRef.current?.scrollIntoView({ behavior: "smooth" });

  // ✅ Open booking form
  const openBookingForm = (venue) => {
    setSelectedVenue(venue);
    setBookingForm({ date: "", time: venue.time || "", players: 1 });
    setModalOpen(true);
  };

  // ✅ Handle booking form changes
  const handleBookingChange = (e) =>
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });

  // ✅ Submit booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVenue) return;

    try {
      const payload = {
        name: selectedVenue.name,
        date: bookingForm.date ? new Date(bookingForm.date) : null,
        time: bookingForm.time,
        players: Number(bookingForm.players),
        venueId: selectedVenue._id,
        pricePerSlot: selectedVenue.price || 0,
      };
      await bookVenue(payload);

      setBookingStatus("success");
      setShowBookingPopup(true);
      setModalOpen(false);
      setSelectedVenue(null);
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingStatus("error");
      setShowBookingPopup(true);
    }
  };

  // ✅ Fetch booking history
  const fetchUserBookings = async () => {
    try {
      setBookings(await getUserBookings());
      setShowBookingHistory(true);
    } catch (err) {
      console.error("Failed to load booking history:", err);
    }
  };

  // ✅ Cancel booking
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBooking(bookingToCancel._id);
      setBookings((prev) => prev.filter((b) => b._id !== bookingToCancel._id));
      setShowCancelPopup(false);
      setBookingToCancel(null);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  // ✅ Sport icon mapper
  const sportIcon = (sport = "") => {
    const s = sport.toLowerCase();
    if (s.includes("football") || s.includes("soccer")) return <FaFutbol className="text-xl" />;
    if (s.includes("basket")) return <FaBasketballBall className="text-xl" />;
    if (s.includes("tennis") && !s.includes("table")) return <GiTennisRacket className="text-xl" />;
    if (s.includes("table tennis") || s.includes("ping")) return <FaTableTennis className="text-xl" />;
    if (s.includes("badminton")) return <GiTennisRacket className="text-xl" />;
    if (s.includes("cricket")) return <GiCricketBat className="text-xl" />;
    if (s.includes("hockey")) return <GiHockey className="text-xl" />;
    if (s.includes("volley")) return <FaVolleyballBall className="text-xl" />;
    if (s.includes("swim")) return <FaSwimmer className="text-xl" />;
    if (s.includes("run")) return <FaRunning className="text-xl" />;
    if (s.includes("cycle")) return <FaBiking className="text-xl" />;
    if (s.includes("baseball")) return <FaBaseballBall className="text-xl" />;
    return <FaFutbol className="text-xl" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        logo={logo}
        profilePicture={profilePicture}
        username={username}
        setSidebarOpen={setSidebarOpen}
        venues={venues}
      />

      <Welcome username={username} scrollToGames={scrollToGames} />

      <VenuesGrid venues={venues} sportIcon={sportIcon} openBookingForm={openBookingForm} gamesRef={gamesRef} />

      {sidebarOpen && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          profilePicture={profilePicture}
          username={username}
          email={email}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          setProfilePicture={setProfilePicture}
          fetchUserBookings={fetchUserBookings}
          setShowLogoutPopup={setShowLogoutPopup}
        />
      )}

      {modalOpen && selectedVenue && (
        <BookingModal
          selectedVenue={selectedVenue}
          bookingForm={bookingForm}
          handleBookingChange={handleBookingChange}
          username={username}
          userId={userId}
          setModalOpen={setModalOpen}
          setSelectedVenue={setSelectedVenue}
          onBookingSuccess={() => { setBookingStatus("success"); setShowBookingPopup(true); }}
          onBookingError={() => { setBookingStatus("error"); setShowBookingPopup(true); }}
        />
      )}

      {showBookingHistory && (
        <BookingHistoryModal
          bookings={bookings}
          setShowBookingHistory={setShowBookingHistory}
          setBookingToCancel={setBookingToCancel}
          setShowCancelPopup={setShowCancelPopup}
        />
      )}

      {/* Popups */}
      {showLogoutPopup && <LogoutPopup onConfirm={handleLogout} onClose={() => setShowLogoutPopup(false)} />}
      {bookingStatus && <BookingPopup bookingStatus={bookingStatus} onClose={() => setBookingStatus(null)} />}
      {showCancelPopup && bookingToCancel && (
        <CancelPopup
          booking={bookingToCancel}
          onConfirm={handleCancelBooking}
          onClose={() => setShowCancelPopup(false)}
        />
      )}
    </div>
  );
}
