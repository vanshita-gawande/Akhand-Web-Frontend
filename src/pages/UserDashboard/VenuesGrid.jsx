// src/pages/UserDashboard/VenuesGrid.jsx
import {
  Trophy,
  MapPin,
  Users,
  CalendarDays,
  Clock,
  Bookmark,
} from "lucide-react";

export default function VenuesGrid({
  venues,
  sportIcon,
  openBookingForm,
  gamesRef,
  sidebarOpen,
}) {
  return (
    <section
      ref={gamesRef}
      className={`w-full px-6 py-10 transition-all duration-300 ${
        sidebarOpen ? "lg:ml-64" : "ml-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Available Venues
      </h2>

      {venues.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No venues available yet.
        </p>
      ) : (
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            gap-5 
            max-w-7xl 
            mx-auto
          "
        >
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="max-w-[18rem] w-full mx-auto bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col"
            >
              {/* Card Header */}
              <div className="flex items-center gap-2.5 p-4 bg-gradient-to-r from-purple-100 via-pink-50 to-white rounded-t-xl border-b border-gray-200">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 text-white text-lg">
                  {sportIcon(venue.sport)}
                </div>
                <h3 className="text-base font-semibold text-purple-700">
                  {venue.name}
                </h3>
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 space-y-2 text-gray-700 text-sm">
                <p className="flex items-center gap-1.5">
                  <Trophy size={16} className="text-purple-600" />
                  <span>
                    <strong>Sport:</strong> {venue.sport}
                  </span>
                </p>

                <p className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-red-500" />
                  <span>
                    <strong>Location:</strong> {venue.location}
                  </span>
                </p>

                <p className="flex items-center gap-1.5">
                  <Users size={16} className="text-green-600" />
                  <span>
                    <strong>Capacity:</strong> {venue.capacity}
                  </span>
                </p>

                <p className="flex items-center gap-1.5">
                  <CalendarDays size={16} className="text-blue-600" />
                  <span>
                    <strong>Date:</strong> {venue.date}
                  </span>
                </p>

                <p className="flex items-center gap-1.5">
                  <Clock size={16} className="text-orange-500" />
                  <span>
                    <strong>Time:</strong> {venue.time || "Flexible"}
                  </span>
                </p>
              </div>
0
              {/* Card Footer */}
              <div className="flex justify-end px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => openBookingForm(venue)}
                  className="px-4 py-1.5 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all shadow-sm flex items-center gap-1.5 text-sm font-medium"
                >
                  <Bookmark size={16} /> Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


// // src/pages/UserDashboard/VenuesGrid.jsx
// import {
//   Trophy,
//   MapPin,
//   Users,
//   CalendarDays,
//   Clock,
//   Bookmark,
// } from "lucide-react";

// export default function VenuesGrid({
//   venues,
//   sportIcon,
//   openBookingForm,
//   gamesRef,
//   sidebarOpen,
// }) {
//   return (
//     <section
//       ref={gamesRef}
//       className={`w-full px-6 py-10 transition-all duration-300 ${
//         sidebarOpen ? "lg:ml-64" : "ml-0"
//       }`}
//     >
//       <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
//         Available Venues
//       </h2>

//       {venues.length === 0 ? (
//         <p className="text-center text-gray-500 italic">
//           No venues available yet.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//           {venues.map((venue) => (
//             <div
//               key={venue._id}
//               className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 flex flex-col overflow-hidden border border-gray-100"
//             >
//               {/* Card Header */}
//               <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-t-3xl">
//                 <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 text-2xl shadow-inner">
//                   {sportIcon(venue.sport)}
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-800 truncate">
//                   {venue.name}
//                 </h3>
//               </div>

//               {/* Card Content */}
//               <div className="p-5 flex-1 space-y-4 text-gray-700 text-sm">
//                 <p className="flex items-center gap-3">
//                   <Trophy size={18} className="text-indigo-500" />
//                   <span>
//                     <strong>Sport:</strong> {venue.sport}
//                   </span>
//                 </p>

//                 <p className="flex items-center gap-3">
//                   <MapPin size={18} className="text-red-400" />
//                   <span>
//                     <strong>Location:</strong> {venue.location}
//                   </span>
//                 </p>

//                 <p className="flex items-center gap-3">
//                   <Users size={18} className="text-green-500" />
//                   <span>
//                     <strong>Capacity:</strong> {venue.capacity}
//                   </span>
//                 </p>

//                 <p className="flex items-center gap-3">
//                   <CalendarDays size={18} className="text-blue-400" />
//                   <span>
//                     <strong>Date:</strong> {venue.date}
//                   </span>
//                 </p>

//                 <p className="flex items-center gap-3">
//                   <Clock size={18} className="text-orange-400" />
//                   <span>
//                     <strong>Time:</strong> {venue.time || "Flexible"}
//                   </span>
//                 </p>
//               </div>

//               {/* Card Footer */}
//               <div className="flex justify-end px-6 py-4 border-t border-gray-100">
//                 <button
//                   onClick={() => openBookingForm(venue)}
//                   className="px-6 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all font-medium text-sm flex items-center gap-2"
//                 >
//                   <Bookmark size={16} /> Book Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }
