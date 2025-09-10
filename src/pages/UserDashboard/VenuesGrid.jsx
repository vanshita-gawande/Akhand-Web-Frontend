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
}) {
  return (
       <section ref={gamesRef} className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Available Venues
        </h2>

        {venues.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No venues available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col"
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 via-pink-50 to-white rounded-t-2xl border-b border-gray-200">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 text-white text-lg">
                    {sportIcon(venue.sport)}
                  </div>
                  <h3 className="text-lg font-semibold text-purple-700">
                    {venue.name}
                  </h3>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 space-y-2 text-gray-700 text-sm">
                  <p className="flex items-center gap-2">
                    <Trophy size={16} className="text-purple-600" />
                    <span>
                      <strong>Sport:</strong> {venue.sport}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-red-500" />
                    <span>
                      <strong>Location:</strong> {venue.location}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Users size={16} className="text-green-600" />
                    <span>
                      <strong>Capacity:</strong> {venue.capacity}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-blue-600" />
                    <span>
                      <strong>Date:</strong> {venue.date}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    <span>
                      <strong>Time:</strong> {venue.time || "Flexible"}
                    </span>
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex justify-end px-4 py-3 border-t border-gray-100">
                  <button
                    onClick={() => openBookingForm(venue)}
                    className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all shadow-sm flex items-center gap-2 font-medium"
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
