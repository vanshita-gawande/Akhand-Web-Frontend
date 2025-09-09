// src/components/VenueList.jsx
import React from "react";
import VenueCard from "./VenueCard"; // must exist already

export default function VenueList({ venues, onRegisterClick }) {
  if (!venues || venues.length === 0) {
    return (
      <p className="text-gray-600 text-center">
        No venues available at the moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <VenueCard
          key={venue._id}
          venue={venue}
          onRegisterClick={onRegisterClick}
        />
      ))}
    </div>
  );
}
