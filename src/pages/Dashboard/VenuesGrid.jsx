// src/pages/UserDashboard/VenuesGrid.jsx
import { Trophy, MapPin, Users, Bookmark } from "lucide-react";
import { useState } from "react";

export default function VenuesGrid({
  venues,
  sportIcon,
  openBookingForm,
  gamesRef,
  sidebarOpen,
}) {
  const [expandedCards, setExpandedCards] = useState({});
  const toggleReadMore = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const displayedVenues = venues.slice(0, 6);

  return (
    <section
      ref={gamesRef}
      className={`w-full px-6 py-10 transition-all duration-300 ${
        sidebarOpen ? "lg:ml-64" : "ml-0"
      }`}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 tracking-wide">
        Featured Venues
      </h2>

      {venues.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No venues available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayedVenues.map((venue) => {
            const isExpanded = expandedCards[venue._id] || false;

            return (
              <div
                key={venue._id}
                className="w-full mx-auto bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
              >
                {/* Card Image */}
                <div className="h-48 w-full relative group">
                  <img
                    src={venue.image || "/images/default-venue.jpg"}
                    alt={venue.name}
                    className="h-full w-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md uppercase tracking-wider animate-pulse">
                    {venue.sport}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/40 text-white px-3 py-1 rounded-md text-xs flex items-center gap-1">
                    <Trophy size={14} /> Popular
                  </div>
                </div>

                {/* Card Header */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                    {venue.name}
                  </h3>
                  <p className="text-sm text-gray-500 italic">
                    Perfect spot for your next game
                  </p>
                </div>

                {/* Card Body */}
                <div className="px-5 pb-4 flex-1 text-gray-700 text-sm space-y-2">
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-red-500" />
                    <span>{venue.location}</span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Users size={16} className="text-green-600" />
                    <span>Capacity: {venue.capacity}</span>
                  </p>
                  {isExpanded && (
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                      {venue.description ||
                        "This venue offers excellent facilities, modern amenities, and a great environment for sports and gatherings."}
                    </p>
                  )}
                  <button
                    onClick={() => toggleReadMore(venue._id)}
                    className="text-indigo-600 hover:underline text-xs font-medium mt-1 transition-all"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-center px-5 py-4 border-t border-gray-100 bg-gray-50">
                  <span className="text-xs text-gray-500 font-medium">
                    Available Now
                  </span>
                  <button
                    onClick={() => openBookingForm(venue)}
                    className="px-4 py-1.5 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all shadow-sm flex items-center gap-2 text-sm font-semibold"
                  >
                    <Bookmark size={16} /> Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
