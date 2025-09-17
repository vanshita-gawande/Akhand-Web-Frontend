// src/pages/Dashboard/VenuesSection.jsx - fetching the venues
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVenues } from "../../api";
import VenuesGrid from "./VenuesGrid"; // Relative path to VenuesGrid.jsx
import { Trophy} from "lucide-react";
import RegisterPromptModal from "./popups/RegisterPromptPopup";

//
import basketballImg from "../../assets/basketball.avif";
import footballImg from "../../assets/football.avif";
import cricketImg from "../../assets/football.avif";
import tennisImg from "../../assets/stadium.avif";
import badmintonImg from "../../assets/football.avif";
import volleyballImg from "../../assets/swimming.avif";


export default function VenuesSection({ limitCards = false, onLoginClick, onRegisterClick }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(false);
  const venueImages = [
    basketballImg,
    footballImg,
    cricketImg,
    tennisImg,
    badmintonImg,
    volleyballImg,
  ];

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

  const handleBooking = (venue) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPrompt(true); // show modal instead of redirect
      return;
    }
    navigate("/userdashboard", { state: { venue } }); // when click on booknow or bookcourt
  };

  // Limit to first 6 cards if on Dashboard
  // When slicing/displaying venues:
  const displayedVenues = (limitCards ? venues.slice(0, 6) : venues).map(
    (venue, index) => ({
      ...venue,
      image: venue.image || venueImages[index % venueImages.length],
    })
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

      {loading && <p className="text-center text-gray-600">Loading venues…</p>}
      {error && (
        <p className="text-center text-red-500">Failed to load venues.</p>
      )}
      {!loading && !error && venues.length === 0 && (
        <p className="text-center text-gray-600">
          No venues available right now.
        </p>
      )}

      {!loading && !error && venues.length > 0 && (
        <VenuesGrid
          venues={displayedVenues}
          openBookingForm={handleBooking}
          sportIcon={(sport) => {
            switch (sport.toLowerCase()) {
              case "football":
                return <Trophy size={16} />;
              case "cricket":
                return <Trophy size={16} />;
              default:
                return <Trophy size={16} />;
            }
          }}
        />
      )}
      <RegisterPromptModal
        isOpen={showPrompt}
        onClose={() => setShowPrompt(false)}
        onLogin={() => {
          setShowPrompt(false);
          // ✅ Instead of navigate, call the parent’s handler
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