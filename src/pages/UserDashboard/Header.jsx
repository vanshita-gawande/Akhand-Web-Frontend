import { useState } from "react";
import { FaBell, FaEnvelope, FaSearch } from "react-icons/fa";

export default function Header({
  logo,
  profilePicture,
  username,
  setSidebarOpen,
  venues, // 👈 using venues now
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredCards([]);
      return;
    }

    // Filter cards based on search term
    const results = venues.filter(
      (venue) =>
        venue.sport.toLowerCase().includes(value.toLowerCase()) ||
        venue.name.toLowerCase().includes(value.toLowerCase()) ||
        venue.location.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredVenues(results);
  };

   const handleSelectVenue = (venue) => {
     console.log("Selected venue:", venue);

     // Optional: scroll to that venue card
     const cardElement = document.getElementById(venue._id);
     if (cardElement) {
       cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
       cardElement.classList.add("ring-2", "ring-indigo-500");
       setTimeout(() => {
         cardElement.classList.remove("ring-2", "ring-indigo-500");
       }, 2000);
     }

     setSearchTerm("");
     setFilteredVenues([]);
   };

  return (
    <header className="sticky top-0 z-40 shadow-md bg-gradient-to-r from-purple-100 via-pink-50 to-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <img src={logo} alt="Logo" className="h-30 w-30" />

        <div className="relative hidden md:flex items-center bg-purple-200 rounded-lg px-2 py-1 w-72">
          <FaSearch className="text-purple-700 mr-2" />
          <input
            type="text"
            placeholder="Search matches, players..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-purple-600 text-purple-800"
            value={searchTerm}
            onChange={handleSearch}
          />
          {filteredVenues.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-purple-300 rounded-lg mt-1 max-h-48 overflow-y-auto z-50 shadow-lg">
              {filteredVenues.map((venue) => (
                <li
                  key={venue._id}
                  onClick={() => handleSelectVenue(venue)}
                  className="px-4 py-2 cursor-pointer hover:bg-purple-100"
                >
                  {venue.sport} – {venue.name} ({venue.location})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-700 hover:text-purple-700">
            <FaBell className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
              3
            </span>
          </button>

          <button className="relative text-gray-700 hover:text-purple-700">
            <FaEnvelope className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
              5
            </span>
          </button>

          <button
            className="w-11 h-11 bg-purple-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-white">
                {username.charAt(0)}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
