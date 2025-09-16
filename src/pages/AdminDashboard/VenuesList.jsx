import {
  Pencil,
  Trash2,
  Trophy,
  MapPin,
  Users,
  CalendarDays,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

// helper to convert "HH:mm" → "h a"
function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return format(new Date(2023, 0, 1, hours, minutes), "h a");
}

export default function VenuesList({ venues, onEdit, onDelete }) {
  return (
    <section className="py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Registered Venues
      </h2>

      {venues.length === 0 ? (
        <p className="text-gray-600 italic text-center">
          No venues registered yet.
        </p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 flex flex-col"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-t-2xl border-b border-gray-200">
                <h3 className="text-lg font-bold text-purple-700 tracking-wide">
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
                    <strong>Date:</strong> {venue.displayDate}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  <span>
                    <strong>Available Slots:</strong>{" "}
                    {venue.openingTime && venue.closingTime
                      ? `${formatTime(venue.openingTime)} – ${formatTime(
                          venue.closingTime
                        )}`
                      : "Not specified"}
                  </span>
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex justify-end gap-3 px-3 py-2 border-t border-gray-100">
                <button
                  onClick={() => onEdit(venue)}
                  className="p-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition shadow-sm"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => onDelete(venue)}
                  className="p-2 rounded-full border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
