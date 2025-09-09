import React, { useState, useEffect } from "react";
import { getVenues } from "../../api";

export default function VenuesSection({ onRegisterClick }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const data = await getVenues();
        setVenues(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <section className="mt-12 space-y-8">
      {/* Big CTA */}
      <div className="text-center">
        <button
          onClick={onRegisterClick}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
        >
          Book Court Now
        </button>
      </div>

      {/* Venue Cards */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Available Venues
        </h3>

        {loading && (
          <p className="text-center text-gray-600">Loading venues…</p>
        )}
        {error && (
          <p className="text-center text-red-500">Failed to load venues.</p>
        )}

        {!loading && !error && venues.length === 0 && (
          <p className="text-center text-gray-600">
            No venues available right now.
          </p>
        )}

        {!loading && !error && venues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {venue.name}
                  </h4>
                  <p className="text-sm text-gray-600">{venue.location}</p>
                  <p className="text-gray-700 mt-2">Sport: {venue.sport}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Capacity: {venue.capacity}
                  </p>

                  <button
                    onClick={onRegisterClick}
                    className="mt-4 w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
