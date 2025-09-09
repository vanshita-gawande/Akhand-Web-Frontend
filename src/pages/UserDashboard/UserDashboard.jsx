// // src/pages/UserDashboard.jsx {Parent-folder}
// import { useState, useEffect, useRef } from "react";
// import logo from "../assets/logo.webp";
// import {
//   FaUserCircle,
//   FaHistory,
//   FaCog,
//   FaBasketballBall,
//   FaTableTennis,
//   FaSignOutAlt,
//   FaCalendarAlt,
//   FaCalendarCheck,
//   FaFutbol,
//   FaTimes,
//   FaPencilAlt,
//   FaBell,
//   FaEnvelope,
//   FaSearch,
//   FaVolleyballBall,
//   FaRunning,
//   FaSwimmer,
//   FaBiking,
//   FaBaseballBall,
// } from "react-icons/fa";
// import { GiCricketBat, GiTennisRacket, GiHockey } from "react-icons/gi";
// import { getVenues, bookVenue, getUserBookings, cancelBooking } from "../../api"; // centralized API
// import {Trophy,MapPin,Users,CalendarDays,Clock,Bookmark,} from "lucide-react";

// export default function UserDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [venues, setVenues] = useState([]);
//   const [selectedVenue, setSelectedVenue] = useState(null);
//   const [bookingForm, setBookingForm] = useState({date: "",time: "",players: 1,});// initially 1 player then can increase
//   const [username, setUsername] = useState("Guest");
//   const [email, setEmail] = useState("user@example.com");
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const gamesRef = useRef(null);
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false);
//   const [showBookingPopup, setShowBookingPopup] = useState(false);
//   const [bookingStatus, setBookingStatus] = useState(null); // "success" | "error"
//   const [showBookingHistory, setShowBookingHistory] = useState(false); // booking history
//   const [bookings, setBookings] = useState([]);
//   const [bookingToCancel, setBookingToCancel] = useState(null); // the booking user wants to cancel
//   const [showCancelPopup, setShowCancelPopup] = useState(false);

//   useEffect(() => {
//     // load user info from localStorage (if stored)
//     const storedUsername = localStorage.getItem("username");
//     const storedEmail = localStorage.getItem("email");
//     const storedProfilePic = localStorage.getItem("profilePicture");
//     if (storedUsername) setUsername(storedUsername);
//     if (storedEmail) setEmail(storedEmail);
//     if (storedProfilePic) setProfilePicture(storedProfilePic);

//     // fetch venues from backend
//     fetchVenues();
//   }, []);

//   const fetchVenues = async () => {
//     try {
//       const data = await getVenues(); // calls getvenues function from api.js and backend response with all venues with an array of objects
//       // Normalize date display like admin
//       const formatted = data.map((v) => ({
//         ...v,
//         date: v.date ? new Date(v.date).toLocaleDateString("en-GB") : "",
//       }));
//       setVenues(formatted); // the data is saved in our stste and then we map through it to display in the UI
//     } catch (err) {
//       console.error("Failed to load venues:", err);
//       // If unauthorized, redirect to login
//       if (err.response?.status === 401) {
//         localStorage.removeItem("token");
//         window.location.href = "/";
//       }
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("username");
//     localStorage.removeItem("email");
//     localStorage.removeItem("profilePicture");
//     window.location.href = "/";
//   };

//   const scrollToGames = () => {
//     gamesRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Open booking modal for a given venue
//   const openBookingForm = (venue) => {
//     setSelectedVenue(venue);
//     setBookingForm({
//       date: "", // user selects
//       time: venue.time || "", // default to venue's time text if present
//       players: 1,
//     });
//     setModalOpen(true);
//   };

//   const handleBookingChange = (e) => {
//     setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
//   };

//   // handle booking form submission
//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedVenue) return;
//     try {
//       const payload = {
//         name: selectedVenue.name,
//         date: bookingForm.date ? new Date(bookingForm.date) : null,
//         time: bookingForm.time,
//         players: Number(bookingForm.players),
//         venueId: selectedVenue._id,
//       };

//       console.log("Booking payload:", payload);

//       await bookVenue(payload);

//       setBookingStatus("success"); // ✅ success
//       setShowBookingPopup(true);

//       setModalOpen(false);
//       setSelectedVenue(null);
//     } catch (err) {
//       console.error(err);

//       setBookingStatus("error"); // ❌ error
//       setShowBookingPopup(true);
//     }
//   };

//  const fetchUserBookings = async () => {
//   try {
//     // console.log("Fetching bookings...");
//     const data = await getUserBookings();
//     console.log("API response:", data);
//     setBookings(data);
//     setShowBookingHistory(true);
//   } catch (err) {
//     console.error("Failed to load booking history:", err);
//   }
//  };
//  const handleCancelBooking = async () => {
//    if (!bookingToCancel) return;
//    try {
//      await cancelBooking(bookingToCancel._id); // call API
//      setBookings(bookings.filter((b) => b._id !== bookingToCancel._id)); // remove from state
//      setShowCancelPopup(false);
//      setBookingToCancel(null);
//    } catch (err) {
//      console.error("Failed to cancel booking:", err);
//      alert("Failed to cancel booking. Please try again.");
//    }
//  };

//   // Small helper to pick an icon based on sport name and then it is displayed in the venue cards it get called  below venue grid
//   const sportIcon = (sport) => {
//     if (!sport) return <FaFutbol className="text-xl" />;
//     const s = sport.toLowerCase();

//     if (s.includes("football") || s.includes("soccer"))
//       return <FaFutbol className="text-xl" />;
//     if (s.includes("basket")) return <FaBasketballBall className="text-xl" />;
//     if (s.includes("tennis") && !s.includes("table"))
//       return <GiTennisRacket className="text-xl" />; // Lawn tennis
//     if (s.includes("table tennis") || s.includes("ping"))
//       return <FaTableTennis className="text-xl" />;
//     if (s.includes("badminton")) return <GiTennisRacket className="text-xl" />;
//     if (s.includes("cricket")) return <GiCricketBat className="text-xl" />;
//     if (s.includes("hockey")) return <GiHockey className="text-xl" />;
//     if (s.includes("volley")) return <FaVolleyballBall className="text-xl" />;
//     if (s.includes("swim")) return <FaSwimmer className="text-xl" />;
//     if (s.includes("run")) return <FaRunning className="text-xl" />;
//     if (s.includes("cycle")) return <FaBiking className="text-xl" />;
//     if (s.includes("baseball")) return <FaBaseballBall className="text-xl" />; // ⚾

//     // fallback
//     return <FaFutbol className="text-xl" />;
//   };
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
      // <header className="sticky top-0 z-40 shadow-md bg-gradient-to-r from-purple-100 via-pink-50 to-white">
      //   <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
      //     <img src={logo} alt="Logo" className="h-30 w-30" />

      //     <div className="hidden md:flex items-center bg-purple-200 rounded-lg px-2 py-1 w-72">
      //       <FaSearch className="text-purple-700 mr-2" />
      //       <input
      //         type="text"
      //         placeholder="Search matches, players..."
      //         className="flex-1 bg-transparent outline-none text-sm placeholder-purple-600 text-purple-800"
      //       />
      //     </div>

      //     <div className="flex items-center gap-6">
      //       <button className="relative text-gray-700 hover:text-purple-700">
      //         <FaBell className="w-5 h-5" />
      //         <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
      //           3
      //         </span>
      //       </button>

      //       <button className="relative text-gray-700 hover:text-purple-700">
      //         <FaEnvelope className="w-5 h-5" />
      //         <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
      //           5
      //         </span>
      //       </button>

      //       <button
      //         className="w-11 h-11 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
      //         onClick={() => setSidebarOpen(true)}
      //       >
      //         {profilePicture ? (
      //           <img
      //             src={profilePicture}
      //             alt="Profile"
      //             className="w-full h-full object-cover"
      //           />
      //         ) : (
      //           <span className="text-lg font-semibold text-white">
      //             {username.charAt(0)}
      //           </span>
      //         )}
      //       </button>
      //     </div>
      //   </nav>
      // </header>

//       {/* Welcome */}
      // <section className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white py-10">
      //   <div className="container mx-auto px-4 text-center">
      //     <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
      //       Welcome back, <span className="text-green-400">{username}</span>
      //     </h2>
      //     <p className="mb-6 text-lg sm:text-xl">
      //       Ready to book your next game?
      //     </p>
      //     <button
      //       onClick={scrollToGames}
      //       className="bg-green-500 hover:bg-green-400 transition duration-300 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md flex items-center justify-center mx-auto"
      //     >
      //       <FaCalendarCheck className="mr-2" />
      //       Book Court Below
      //     </button>
      //   </div>
      // </section>

//       {/* Venues grid */}
//       <section ref={gamesRef} className="container mx-auto px-4 py-12">
//         <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
//           Available Venues
//         </h2>

//         {venues.length === 0 ? (
//           <p className="text-center text-gray-500 italic">
//             No venues available yet.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {venues.map((venue) => (
//               <div
//                 key={venue._id}
//                 className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col"
//               >
//                 {/* Card Header */}
//                 <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 via-pink-50 to-white rounded-t-2xl border-b border-gray-200">
//                   <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 text-white text-lg">
//                     {sportIcon(venue.sport)}
//                   </div>
//                   <h3 className="text-lg font-semibold text-purple-700">
//                     {venue.name}
//                   </h3>
//                 </div>

//                 {/* Card Content */}
//                 <div className="p-4 flex-1 space-y-2 text-gray-700 text-sm">
//                   <p className="flex items-center gap-2">
//                     <Trophy size={16} className="text-purple-600" />
//                     <span>
//                       <strong>Sport:</strong> {venue.sport}
//                     </span>
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <MapPin size={16} className="text-red-500" />
//                     <span>
//                       <strong>Location:</strong> {venue.location}
//                     </span>
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <Users size={16} className="text-green-600" />
//                     <span>
//                       <strong>Capacity:</strong> {venue.capacity}
//                     </span>
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <CalendarDays size={16} className="text-blue-600" />
//                     <span>
//                       <strong>Date:</strong> {venue.date}
//                     </span>
//                   </p>

//                   <p className="flex items-center gap-2">
//                     <Clock size={16} className="text-orange-500" />
//                     <span>
//                       <strong>Time:</strong> {venue.time || "Flexible"}
//                     </span>
//                   </p>
//                 </div>

//                 {/* Card Footer */}
//                 <div className="flex justify-end px-4 py-3 border-t border-gray-100">
//                   <button
//                     onClick={() => openBookingForm(venue)}
//                     className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all shadow-sm flex items-center gap-2 font-medium"
//                   >
//                     <Bookmark size={16} /> Book Now
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Sidebar (same as before) */}
      // {sidebarOpen && (
      //   <div className="fixed inset-0 flex justify-end z-50">
      //     <div className="relative bg-white w-80 h-full shadow-lg p-6 flex flex-col">
      //       <button
      //         className="absolute top-4 right-4 text-gray-500 hover:text-black"
      //         onClick={() => setSidebarOpen(false)}
      //       >
      //         <FaTimes className="text-xl" />
      //       </button>
      //       <div className="flex flex-col items-center mb-6 mt-4 pr-3">
      //         <div className="relative mb-4">
      //           <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500">
      //             {profilePicture ? (
      //               <img
      //                 src={profilePicture}
      //                 alt="Profile"
      //                 className="w-full h-full object-cover object-center"
      //               />
      //             ) : (
      //               <FaUserCircle className="text-gray-400 w-full h-full" />
      //             )}
      //           </div>
      //           <button
      //             onClick={() => setShowMenu((prev) => !prev)}
      //             className="absolute bottom-0 left-0 bg-gray-800 text-white px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 hover:bg-gray-700 shadow-md"
      //           >
      //             <FaPencilAlt className="w-3 h-3" /> Edit
      //           </button>

      //           {showMenu && (
      //             <div className="absolute mt-2 top-full right-0 w-40 bg-white rounded-md shadow-lg border z-10">
      //               <label
      //                 htmlFor="profile-upload"
      //                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      //               >
      //                 Upload a photo
      //               </label>
      //               <input
      //                 id="profile-upload"
      //                 type="file"
      //                 accept="image/*"
      //                 className="hidden"
      //                 onChange={(e) => {
      //                   const file = e.target.files[0];
      //                   if (file) {
      //                     const reader = new FileReader();
      //                     reader.onload = (ev) => {
      //                       const imageDataUrl = ev.target.result;
      //                       setProfilePicture(imageDataUrl);
      //                       localStorage.setItem(
      //                         "profilePicture",
      //                         imageDataUrl
      //                       );
      //                     };
      //                     reader.readAsDataURL(file);
      //                   }
      //                 }}
      //               />

      //               <button
      //                 onClick={() => {
      //                   setProfilePicture(null);
      //                   localStorage.removeItem("profilePicture");
      //                 }}
      //                 className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      //               >
      //                 Remove photo
      //               </button>
      //             </div>
      //           )}
      //         </div>

      //         <h2 className="font-bold text-xl text-gray-800">{username}</h2>
      //         <p className="text-sm text-gray-500">
      //           @{username.replace(/\s+/g, "").toLowerCase()}
      //         </p>
      //         <p className="text-sm text-gray-500 mt-2 flex items-center">
      //           <FaCalendarAlt className="mr-2" />
      //           {email}
      //         </p>
      //       </div>

      //       <hr className="my-4" />

      //       <nav className="flex flex-col gap-2">
      //         <button className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800">
      //           <FaUserCircle className="mr-3 text-indigo-600" />
      //           <span>Profile</span>
      //         </button>
      //         <button
      //           onClick={() => {
      //             console.log("Booking history button clicked ✅");
      //             fetchUserBookings();
      //           }}
      //           className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800"
      //         >
      //           <FaHistory className="mr-3 text-indigo-600" />
      //           <span>Booking History</span>
      //         </button>

      //         <button className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800">
      //           <FaCog className="mr-3 text-indigo-600" />
      //           <span>Settings</span>
      //         </button>
      //         <button
      //           onClick={() => setShowLogoutPopup(true)} // 👈 instead of directly logging out
      //           className="flex items-center text-left p-3 hover:bg-red-50 rounded-lg transition-colors duration-300 text-red-600 mt-4"
      //         >
      //           <FaSignOutAlt className="mr-3" />
      //           <span>Log Out</span>
      //         </button>
      //       </nav>
      //     </div>
      //   </div>
      // )}

//       {/* Booking Modal */}
//       {modalOpen && selectedVenue && (
        // <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-opacity-50 z-50">
        //   <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
        //     <h2 className="text-xl font-semibold mb-4 flex items-center">
        //       <FaCalendarAlt className="mr-2 text-indigo-600" />
        //       Book {selectedVenue.name}
        //     </h2>

        //     <form onSubmit={handleBookingSubmit} className="space-y-4">
        //       <div>
        //         <label className="block text-sm font-medium mb-1">Name</label>
        //         <input
        //           type="text"
        //           value={username}
        //           readOnly
        //           className="w-full px-3 py-2 border rounded-md bg-gray-100"
        //         />
        //       </div>

        //       <div>
        //         <label className="block text-sm font-medium mb-1">Date</label>
        //         <input
        //           name="date"
        //           type="date"
        //           value={bookingForm.date}
        //           onChange={handleBookingChange}
        //           className="w-full px-3 py-2 border rounded-md"
        //           required
        //         />
        //       </div>

        //       <div>
        //         <label className="block text-sm font-medium mb-1">Time</label>
        //         <input
        //           name="time"
        //           type="time"
        //           value={bookingForm.time}
        //           onChange={handleBookingChange}
        //           className="w-full px-3 py-2 border rounded-md"
        //           required
        //         />
        //         <p className="text-xs text-gray-500 mt-1">
        //           Default: {selectedVenue.time || "flexible"}
        //         </p>
        //       </div>

        //       <div>
        //         <label className="block text-sm font-medium mb-1">
        //           Number of Players
        //         </label>
        //         <input
        //           name="players"
        //           type="number"
        //           min="1"
        //           max={selectedVenue.capacity || 20}
        //           value={bookingForm.players}
        //           onChange={handleBookingChange}
        //           className="w-full px-3 py-2 border rounded-md"
        //           required
        //         />
        //       </div>

        //       <div className="flex justify-end gap-3 mt-6">
        //         <button
        //           type="button"
        //           className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300"
        //           onClick={() => {
        //             setModalOpen(false);
        //             setSelectedVenue(null);
        //           }}
        //         >
        //           Cancel
        //         </button>
        //         <button
        //           type="submit"
        //           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
        //         >
        //           Confirm Booking
        //         </button>
        //       </div>
        //     </form>
        //   </div>
        // </div>
//       )}
//       {/* booking history model */}
//       {showBookingHistory && (
        // <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        //   <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        //     <button
        //       onClick={() => setShowBookingHistory(false)}
        //       className="absolute top-3 right-3 text-gray-500 hover:text-black"
        //     >
        //       <FaTimes className="text-xl" />
        //     </button>

        //     <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
        //       <FaHistory className="mr-2" /> Your Booking History
        //     </h2>

        //     {bookings.length === 0 ? (
        //       <p className="text-gray-500 text-center">No bookings found.</p>
        //     ) : (
        //       <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        //         {bookings.map((booking) => (
        //           <div
        //             key={booking._id}
        //             className="p-4 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50"
        //           >
        //             <h3 className="font-semibold text-lg text-purple-700">
        //               {booking.venueId?.name || "Venue"}
        //             </h3>
        //             <p className="text-sm text-gray-600">
        //               <strong>Sport:</strong> {booking.venueId?.sport || "N/A"}
        //             </p>
        //             <p className="text-sm text-gray-600">
        //               <strong>Location:</strong>{" "}
        //               {booking.venueId?.location || "N/A"}
        //             </p>
        //             <p className="text-sm text-gray-600">
        //               <strong>Date:</strong>{" "}
        //               {new Date(booking.date).toLocaleDateString("en-GB")}
        //             </p>
        //             <p className="text-sm text-gray-600">
        //               <strong>Time:</strong> {booking.time || "Flexible"}
        //             </p>
        //             <p className="text-sm text-gray-600">
        //               <strong>Players:</strong> {booking.players}
        //             </p>
        //             <p
        //               className={`text-sm font-medium mt-2 ${
        //                 booking.status === "booked"
        //                   ? "text-green-600"
        //                   : "text-red-600"
        //               }`}
        //             >
        //               Status:{" "}
        //               {booking.status.charAt(0).toUpperCase() +
        //                 booking.status.slice(1)}
        //             </p>

        //             {/* Cancel Booking Button */}
        //             {booking.status === "booked" && (
        //               <button
        //                 onClick={() => {
        //                   setBookingToCancel(booking);
        //                   setShowCancelPopup(true);
        //                 }}
        //                 className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        //               >
        //                 Cancel Booking
        //               </button>
        //             )}
        //           </div>
        //         ))}
        //       </div>
        //     )}
        //   </div>
        // </div>
//       )}
//       {/* logout popups */}
//       {showLogoutPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center blackdrop-blurr bg-opacity-40 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">
//               Confirm Logout
//             </h3>
//             <p className="text-sm text-gray-600 mb-6">
//               Are you sure you want to log out?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setShowLogoutPopup(false)}
//                 className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
//               >
//                 Yes, Log Out
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Booking Success / Error Popup */}
//       {showBookingPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
//           <div className="bg-white rounded-2xl shadow-xl p-6 w-96 text-center">
//             <h2
//               className={`text-xl font-bold mb-4 ${
//                 bookingStatus === "error" ? "text-red-600" : "text-green-600"
//               }`}
//             >
//               {bookingStatus === "error"
//                 ? "❌ Booking Failed"
//                 : "✅ Booking Confirmed"}
//             </h2>
//             <p className="text-gray-700">
//               {bookingStatus === "error"
//                 ? "We couldn’t complete your booking. Please try again."
//                 : "Your booking has been successfully confirmed!"}
//             </p>
//             <button
//               onClick={() => setShowBookingPopup(false)}
//               className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//       {/* Cancel Booking Confirmation Popup */}
//       {showCancelPopup && bookingToCancel && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
//             <h3 className="text-lg font-bold text-gray-800 mb-4">
//               Confirm Cancellation
//             </h3>
//             <p className="text-sm text-gray-600 mb-6">
//               Are you sure you want to cancel your booking for{" "}
//               <strong>{bookingToCancel.venueId?.name}</strong> on{" "}
//               {new Date(bookingToCancel.date).toLocaleDateString("en-GB")}?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setShowCancelPopup(false)}
//                 className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
//               >
//                 No
//               </button>
//               <button
//                 onClick={handleCancelBooking}
//                 className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
//               >
//                 Yes, Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/UserDashboard/UserDashboard.jsx
import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.webp";
import { FaBasketballBall, FaTableTennis, FaFutbol,
 FaVolleyballBall,
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
  //State is data that a component owns and can change over time. and can use for Example: opening/closing sidebar, booking modals, dropdown menus.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "",
    players: 1,
  });
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("user@example.com");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const gamesRef = useRef(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // Functions like handleBookingSubmit, scrollToGames are event handlers.They are passed down as props to child components to trigger actions in the parent.
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedProfilePic = localStorage.getItem("profilePicture");
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (storedProfilePic) setProfilePicture(storedProfilePic);

    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const data = await getVenues();
      const formatted = data.map((v) => ({
        ...v,
        date: v.date ? new Date(v.date).toLocaleDateString("en-GB") : "",
      }));
      setVenues(formatted);
    } catch (err) {
      console.error("Failed to load venues:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const scrollToGames = () => {
    gamesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openBookingForm = (venue) => {
    setSelectedVenue(venue);
    setBookingForm({
      date: "",
      time: venue.time || "",
      players: 1,
    });
    setModalOpen(true);
  };

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

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
      };

      await bookVenue(payload);

      setBookingStatus("success");
      setShowBookingPopup(true);
      setModalOpen(false);
      setSelectedVenue(null);
    } catch (err) {
      console.error(err);
      setBookingStatus("error");
      setShowBookingPopup(true);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const data = await getUserBookings();
      setBookings(data);
      setShowBookingHistory(true);
    } catch (err) {
      console.error("Failed to load booking history:", err);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBooking(bookingToCancel._id);
      setBookings(bookings.filter((b) => b._id !== bookingToCancel._id));
      setShowCancelPopup(false);
      setBookingToCancel(null);
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const sportIcon = (sport) => {
    if (!sport) return <FaFutbol className="text-xl" />;
    const s = sport.toLowerCase();

    if (s.includes("football") || s.includes("soccer"))
      return <FaFutbol className="text-xl" />;
    if (s.includes("basket")) return <FaBasketballBall className="text-xl" />;
    if (s.includes("tennis") && !s.includes("table"))
      return <GiTennisRacket className="text-xl" />;
    if (s.includes("table tennis") || s.includes("ping"))
      return <FaTableTennis className="text-xl" />;
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
      />

      <Welcome username={username} scrollToGames={scrollToGames} />

      <VenuesGrid
        venues={venues}
        sportIcon={sportIcon}
        openBookingForm={openBookingForm}
        gamesRef={gamesRef}
      />

      {sidebarOpen && (
        <Sidebar
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
          handleBookingSubmit={handleBookingSubmit}
          username={username}
          setModalOpen={setModalOpen}
          setSelectedVenue={setSelectedVenue}
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

      {/* popups */}
      {showLogoutPopup && (
        <LogoutPopup
          onConfirm={handleLogout}
          onClose={() => setShowLogoutPopup(false)}
        />
      )}

      {bookingStatus && (
        <BookingPopup
          bookingStatus={bookingStatus}
          onClose={() => setBookingStatus(null)}
        />
      )}

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
