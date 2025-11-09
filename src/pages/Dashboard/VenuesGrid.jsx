// src/pages/UserDashboard/VenuesGrid.jsx
import {  MapPin, Users, Bookmark  } from "lucide-react";
import { useState } from "react";

export default function VenuesGrid({
  venues,
  openBookingForm,
  gamesRef,
  sidebarOpen,
}) {
  const [selectedVenue, setSelectedVenue] = useState(null);

  const displayedVenues = venues.slice(0, 6);

  return (
    <section
      ref={gamesRef}
      className={`w-full px-6 py-12 transition-all duration-300 ${
        sidebarOpen ? "lg:ml-64" : "ml-0"
      }`}
    >
      {/* Section Heading */}
      <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-14 tracking-wide uppercase">
        Featured Venues
      </h2>

      {/* If no venues */}
      {venues.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No venues available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {displayedVenues.map((venue) => (
            <div
              key={venue._id}
              className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={venue.image || "/images/default-venue.jpg"}
                  alt={venue.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />

                {/* Sport Tag (top-left, softer indigo) */}
                <div
                  className="absolute top-2 left-2 bg-indigo-500/80 text-white px-2 py-0.5 
                    text-[11px] font-medium uppercase tracking-wide shadow-sm"
                >
                  {venue.sport}
                </div>

                {/* Popular Tag (top-right, softer yellow) */}
                {/* <div
                  className="absolute top-2 right-2 px-2 py-0.5 text-[11px] font-medium flex items-center gap-1 
    bg-yellow-300/90 text-gray-900 shadow-sm"
                >
                  <Star size={12} />
                </div> */}
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 border-b-2 border-indigo-500 inline-block pb-1">
                    {venue.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {venue.description?.slice(0, 90) || "Great spot for sports"}
                    {venue.description?.length > 90 && "..."}
                  </p>
                  <div className="flex flex-col gap-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-red-500" />{" "}
                      {venue.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users size={16} className="text-green-600" /> Capacity:{" "}
                      {venue.capacity}
                    </p>
                  </div>
                </div>

                {/* Actions (kept as your old Book Now button) */}
                <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setSelectedVenue(venue)}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium tracking-wide uppercase"
                  >
                    Read More →
                  </button>
                  <button
                    onClick={() => openBookingForm(venue)}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm uppercase tracking-wide hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2"
                  >
                    <Bookmark size={16} /> Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Read More Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white shadow-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[90vh] border-2 border-indigo-600">
            <button
              onClick={() => setSelectedVenue(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-lg font-bold"
            >
              ✕
            </button>
            <img
              src={selectedVenue.image || "/images/default-venue.jpg"}
              alt={selectedVenue.name}
              className="w-full h-60 object-cover mb-6 border-b-4 border-indigo-600"
            />
            <h3 className="text-3xl font-extrabold text-indigo-700 mb-4 uppercase tracking-wide">
              {selectedVenue.name}
            </h3>
            <p className="text-gray-800 text-base leading-relaxed mb-6">
              {selectedVenue.description ||
                "This venue offers excellent facilities, modern amenities, and a great environment for sports and gatherings."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
              <p className="flex items-center gap-2 bg-gray-100 px-3 py-2">
                <MapPin size={16} className="text-red-500" />{" "}
                {selectedVenue.location}
              </p>
              <p className="flex items-center gap-2 bg-gray-100 px-3 py-2">
                <Users size={16} className="text-green-600" /> Capacity:{" "}
                {selectedVenue.capacity}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}