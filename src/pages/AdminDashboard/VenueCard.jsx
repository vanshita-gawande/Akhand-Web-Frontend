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

// helper to format "HH:mm" → "h a"
function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return format(new Date(2023, 0, 1, hours, minutes), "h a");
}

export default function VenueCard({ venue, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 flex flex-col">
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-t-2xl border-b border-gray-200">
        <h3 className="text-lg font-bold text-purple-700 tracking-wide">
          {venue.name}
        </h3>
      </div>
      <div className="p-3 flex-1 space-y-2 text-gray-700 text-sm">
        <p className="flex items-center gap-2">
          <Trophy size={16} className="text-purple-600" />{" "}
          <strong>Sport:</strong> {venue.sport}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-red-500" />{" "}
          <strong>Location:</strong> {venue.location}
        </p>
        <p className="flex items-center gap-2">
          <Users size={16} className="text-green-600" />{" "}
          <strong>Capacity:</strong> {venue.capacity}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays size={16} className="text-blue-600" />{" "}
          <strong>Date:</strong> {venue.displayDate}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} className="text-orange-500" />{" "}
          <strong>Available Slots:</strong>{" "}
          {venue.openingTime && venue.closingTime
            ? `${formatTime(venue.openingTime)} – ${formatTime(
                venue.closingTime
              )}`
            : "Not specified"}
        </p>
      </div>
      <div className="flex justify-end gap-3 px-3 py-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(venue)}
          className="p-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition shadow-sm"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(venue._id)}
          className="p-2 rounded-full border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition shadow-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
