// src/pages/Dashboard/VenuesSection.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVenues } from "../../api";
import VenuesGrid from "./VenuesGrid";
import { Trophy } from "lucide-react";
import RegisterPromptModal from "./popups/RegisterPromptPopup";

// ✅ Import all sport images mapping
import { sportImages } from "../../assets/images/sportsimages.js";

// 🔹 Simple skeleton loader for venue cards
function VenuesSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 animate-pulse rounded-md h-72 w-full"
          />
        ))}
    </div>
  );
}

export default function VenuesSection({
  limitCards = false,
  onLoginClick,
  onRegisterClick,
}) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);

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
    const interval = setInterval(fetchVenues, 3600000); // refresh every 1 hour
    return () => clearInterval(interval);
  }, []);

  const handleBooking = (venue) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPrompt(true);
      return;
    }
    navigate("/userdashboard", { state: { venue } });
  };

  // ✅ Assign sport-based images (unique per sport)
  const sportCounters = {}; // track index per sport

  const displayedVenues = (limitCards ? venues.slice(0, 6) : venues).map(
    (venue) => {
      const sportKey = venue.sport?.toLowerCase().replace(/\s+/g, "-");
      const images = sportImages[sportKey] || [];

      if (!sportCounters[sportKey]) sportCounters[sportKey] = 0;

      const chosenImage =
        images.length > 0
          ? images[sportCounters[sportKey] % images.length]
          : "/default-stadium.jpg";

      sportCounters[sportKey]++;

      return { ...venue, image: venue.image || chosenImage };
    }
  );

  return (
    <section className="mt-12 space-y-8">
      {/* Big CTA Button */}
      <div className="text-center">
        <button
          onClick={() => handleBooking(null)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
        >
          Book Court Now
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && <VenuesSkeleton count={limitCards ? 6 : 9} />}

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-md shadow-sm flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-semibold">Failed to load venues</p>
            <p className="text-sm text-red-600 mt-0.5">
              Something went wrong while fetching venues. Please try again.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="ml-4 text-sm font-medium text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && venues.length === 0 && (
        <p className="text-center text-gray-600">
          No venues available right now.
        </p>
      )}

      {/* Grid */}
      {!loading && !error && venues.length > 0 && (
        <VenuesGrid
          venues={displayedVenues}
          openBookingForm={handleBooking}
          sportIcon={(sport) => <Trophy size={16} />}
        />
      )}

      {/* Register/Login Prompt */}
      <RegisterPromptModal
        isOpen={showPrompt}
        onClose={() => setShowPrompt(false)}
        onLogin={() => {
          setShowPrompt(false);
          if (typeof onLoginClick === "function") onLoginClick();
        }}
        onRegister={() => {
          setShowPrompt(false);
          if (typeof onRegisterClick === "function") onRegisterClick();
        }}
      />
    </section>
  );
}
