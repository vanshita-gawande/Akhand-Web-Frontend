import { useState } from "react";
import { FaTimes, FaHistory, FaSearch } from "react-icons/fa";

export default function BookingHistoryModal({
  bookings,
  setShowBookingHistory,
  setBookingToCancel,
  setShowCancelPopup,
}) {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const bookingsPerPage = 10;

  // Helper to get the first non-empty value
  const getFirstValid = (...values) => {
    for (let val of values) {
      if (val !== null && val !== undefined && val !== "") return val;
    }
    return "N/A";
  };

  // Filtering bookings based on search term
  const filteredBookings = bookings.filter((booking) => {
    const query = searchTerm.toLowerCase();

    const venueName = getFirstValid(booking.venueId?.name, booking.name);
    const sport = getFirstValid(booking.venueId?.sport, booking.sport);
    const location = getFirstValid(booking.venueId?.location, booking.location);
    const date = new Date(booking.date).toLocaleDateString("en-GB"); // formatted date
    

    return (
      venueName.toLowerCase().includes(query) ||
      sport.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query) ||
      date.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const endIndex = startIndex + bookingsPerPage;
  const visibleBookings = showAll
    ? filteredBookings.slice(startIndex, endIndex)
    : filteredBookings.slice(0, 2);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setShowBookingHistory(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Title + Search (Centered) */}
        <div className="flex flex-col items-center justify-center mb-6 gap-3 text-center">
          <h2 className="text-2xl font-extrabold text-indigo-500 tracking-wide flex items-center">
            <FaHistory className="mr-2" /> Your Booking History
          </h2>

          {/* Search Bar */}
          <div className="relative flex items-center bg-indigo-100 rounded-lg px-3 py-2 w-full max-w-md shadow-sm">
            <FaSearch className="text-indigo-600 mr-2" />
            <input
              type="text"
              placeholder="Search by venue, sport, date..."
              className="flex-1 bg-transparent outline-none text-sm text-indigo-900 placeholder-indigo-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* No bookings */}
        {filteredBookings.length === 0 ? (
          <p className="text-gray-500 text-center">No bookings found.</p>
        ) : (
          <>
            {/* Scrollable container */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                {visibleBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="p-4 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50"
                  >
                    <h3 className="font-semibold text-lg text-purple-700">
                      {getFirstValid(booking.venueId?.name, booking.name)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Sport:</strong>{" "}
                      {getFirstValid(booking.venueId?.sport, booking.sport)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Location:</strong>{" "}
                      {getFirstValid(
                        booking.venueId?.location,
                        booking.location
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong>{" "}
                      {new Date(booking.date).toLocaleDateString("en-GB")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Time:</strong>{" "}
                      {Array.isArray(booking.time)
                        ? booking.time.join(", ")
                        : getFirstValid(booking.time, "Flexible")}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Players:</strong> {booking.players}
                    </p>
                    <p
                      className={`text-sm font-medium mt-2 ${
                        booking.status === "booked"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Status:{" "}
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </p>

                    {/* Cancel Booking Button */}
                    {booking.status === "booked" && (
                      <button
                        onClick={() => {
                          setBookingToCancel(booking);
                          setShowCancelPopup(true);
                        }}
                        className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Show More / Show Less */}
            {filteredBookings.length > 2 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    setShowAll(!showAll);
                    setCurrentPage(1);
                  }}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}

            {/* Pagination */}
            {showAll && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium shadow 
                    ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium shadow 
                        ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium shadow 
                    ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// // src/pages/UserDashboard/BookingHistoryModal.jsx
// import { useState } from "react";
// import { FaTimes, FaHistory, FaSearch } from "react-icons/fa";

// export default function BookingHistoryModal({
//   bookings,
//   setShowBookingHistory,
//   setBookingToCancel,
//   setShowCancelPopup,
// }) {
//   const [showAll, setShowAll] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const bookingsPerPage = 10;

//   // 🔎 Filter bookings based on sport, location, or venue name
//   const filteredBookings = bookings.filter((booking) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       booking.venueId?.sport?.toLowerCase().includes(query) ||
//       booking.venueId?.location?.toLowerCase().includes(query) ||
//       booking.venueId?.name?.toLowerCase().includes(query)
//     );
//   });

//   // Pagination is based on filtered results
//   const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
//   const startIndex = (currentPage - 1) * bookingsPerPage;
//   const endIndex = startIndex + bookingsPerPage;

//   const visibleBookings = showAll
//     ? filteredBookings.slice(startIndex, endIndex)
//     : filteredBookings.slice(0, 2);

//   // Helper to safely get nested value or fallback
//   const getField = (primaryObj, field, fallback = "N/A") => {
//     const val =
//       primaryObj?.[field] !== undefined && primaryObj?.[field] !== ""
//         ? primaryObj[field]
//         : null;
//     return val || fallback;
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative max-h-[85vh] flex flex-col">
//         {/* Close Button */}
//         <button
//           onClick={() => setShowBookingHistory(false)}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black"
//         >
//           <FaTimes className="text-xl" />
//         </button>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
//           <FaHistory className="mr-2" /> Your Booking History
//         </h2>

//         {/* 🔎 Search Bar */}
//         <div className="relative mb-4">
//           <input
//             type="text"
//             placeholder="Search by sport, location, or venue..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1); // reset to first page when searching
//             }}
//             className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//           <FaSearch className="absolute top-3 left-3 text-gray-400" />
//         </div>

//         {/* No bookings */}
//         {filteredBookings.length === 0 ? (
//           <p className="text-gray-500 text-center">No bookings found.</p>
//         ) : (
//           <>
//             {/* Scrollable container */}
//             <div className="flex-1 overflow-y-auto pr-2">
//               <div className="space-y-4">
//                 {visibleBookings.map((booking) => (
//                   <div
//                     key={booking._id}
//                     className="p-4 rounded-lg border shadow-sm hover:shadow-md transition bg-gray-50"
//                   >
//                     <h3 className="font-semibold text-lg text-purple-700">
//                       {getField(
//                         booking.venueId,
//                         "name",
//                         booking.name || "Venue"
//                       )}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       <strong>Sport:</strong>{" "}
//                       {getField(
//                         booking.venueId,
//                         "sport",
//                         booking.sport || "N/A"
//                       )}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <strong>Location:</strong>{" "}
//                       {getField(
//                         booking.venueId,
//                         "location",
//                         booking.location || "N/A"
//                       )}
//                     </p>

//                     <p className="text-sm text-gray-600">
//                       <strong>Date:</strong>{" "}
//                       {new Date(booking.date).toLocaleDateString("en-GB")}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <strong>Time:</strong>{" "}
//                       {Array.isArray(booking.time)
//                         ? booking.time.join(", ")
//                         : getField({ time: booking.time }, "time", "Flexible")}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <strong>Players:</strong> {booking.players}
//                     </p>
//                     <p
//                       className={`text-sm font-medium mt-2 ${
//                         booking.status === "booked"
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       Status:{" "}
//                       {booking.status.charAt(0).toUpperCase() +
//                         booking.status.slice(1)}
//                     </p>

//                     {/* Cancel Booking Button */}
//                     {booking.status === "booked" && (
//                       <button
//                         onClick={() => {
//                           setBookingToCancel(booking);
//                           setShowCancelPopup(true);
//                         }}
//                         className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
//                       >
//                         Cancel Booking
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Show More / Show Less */}
//             {filteredBookings.length > 2 && (
//               <div className="flex justify-center mt-4">
//                 <button
//                   onClick={() => {
//                     setShowAll(!showAll);
//                     setCurrentPage(1);
//                   }}
//                   className="text-indigo-600 font-medium hover:underline"
//                 >
//                   {showAll ? "Show Less" : "Show More"}
//                 </button>
//               </div>
//             )}

//             {/* Pagination */}
//             {showAll && totalPages > 1 && (
//               <div className="flex justify-center items-center gap-2 mt-4">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => p - 1)}
//                   className={`px-3 py-1 rounded-lg text-sm font-medium shadow
//                     ${
//                       currentPage === 1
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-indigo-500 text-white hover:bg-indigo-600"
//                     }`}
//                 >
//                   Prev
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (page) => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`px-3 py-1 rounded-lg text-sm font-medium shadow
//                         ${
//                           currentPage === page
//                             ? "bg-indigo-600 text-white"
//                             : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
//                         }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 )}

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((p) => p + 1)}
//                   className={`px-3 py-1 rounded-lg text-sm font-medium shadow
//                     ${
//                       currentPage === totalPages
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-indigo-500 text-white hover:bg-indigo-600"
//                     }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
