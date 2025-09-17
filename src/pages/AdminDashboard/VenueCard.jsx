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
    <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 tracking-wide">
          {venue.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 space-y-2 text-gray-700 text-sm">
        <p className="flex items-center gap-2">
          <Trophy size={16} className="text-gray-500" />
          <strong>Sport:</strong> {venue.sport}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <strong>Location:</strong> {venue.location}
        </p>
        <p className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <strong>Capacity:</strong> {venue.capacity}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays size={16} className="text-gray-500" />
          <strong>Date:</strong> {venue.displayDate}
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <strong>Available Slots:</strong>{" "}
          {venue.openingTime && venue.closingTime
            ? `${formatTime(venue.openingTime)} – ${formatTime(
                venue.closingTime
              )}`
            : "Not specified"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 px-3 py-2 border-t border-gray-200">
        <button
          onClick={() => onEdit(venue)}
          className="p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition shadow-sm"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(venue._id)}
          className="p-2 rounded border border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 transition shadow-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
