import { useState, useEffect, useRef } from "react";
import logo from '../assets/logo.webp';
import {
  FaUserCircle,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaCalendarAlt,
  FaCalendarCheck,
  FaFutbol,
  FaBasketballBall,
  FaTableTennis,
  FaMapMarkerAlt,
  FaClock,
  FaBookmark,
  FaTimes,
  FaPencilAlt,
  FaBell,
  FaEnvelope,
  FaSearch
} from "react-icons/fa";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("");
  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("user@example.com");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const gamesRef = useRef(null);

  useEffect(() => {
    // Get user data from localStorage (assuming it was stored during login)
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedProfilePic = localStorage.getItem("profilePicture");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (storedProfilePic) setProfilePicture(storedProfilePic);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePicture");
    window.location.href = "/";
  };

  const openBookingForm = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setProfilePicture(imageDataUrl);
        localStorage.setItem("profilePicture", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  // to remove or edit picuture
  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    localStorage.removeItem("profilePicture");
  };


  const scrollToGames = () => {
    gamesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const games = [
    {
      name: "Football",
      court: "Court A",
      time: "7:00 AM - 9:00 PM",
      icon: <FaFutbol className="text-xl" />,
      color: "bg-blue-500",
    },
    {
      name: "Basketball",
      court: "Court B",
      time: "6:00 AM - 10:00 PM",
      icon: <FaBasketballBall className="text-xl" />,
      color: "bg-orange-500",
    },
    {
      name: "Tennis",
      court: "Court C",
      time: "8:00 AM - 8:00 PM",
      icon: <FaTableTennis className="text-xl" />,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          {/* Brand Title */}
          <img src={logo} alt="Akhand Logo" className="h-35 w-35" />
          {/* Middle Search Bar (optional) */}
          <div className="hidden md:flex items-center bg-indigo-600 rounded-lg px-2 py-1 w-72">
            <FaSearch className="text-white mr-2" />
            <input
              type="text"
              placeholder="Search matches, players..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-200 text-white"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative">
              <FaBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                3
              </span>
            </button>

            {/* Messages */}
            <button className="relative">
              <FaEnvelope className="w-5 h-5" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                5
              </span>
            </button>

            {/* Profile Button */}
            <button
              className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
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

      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          {/* Greeting */}
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
            Welcome back, <span className="text-green-400">{username}</span>
          </h2>
          <p className="mb-6 text-lg sm:text-xl">
            Ready to book your next game?
          </p>

          {/* Book button */}
          <button
            onClick={scrollToGames}
            className="bg-green-500 hover:bg-green-400 transition duration-300 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md flex items-center justify-center mx-auto"
          >
            <FaCalendarCheck className="mr-2" />
            Book Court Below
          </button>
        </div>
      </section>

      {/* Game Cards Section with ref for scrolling */}
      <section
        ref={gamesRef}
        className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 md:col-span-3 text-center mb-4">
          Available Sports
        </h2>
        {games.map((game, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transform transition duration-300 hover:scale-105"
          >
            <div>
              <div className="flex items-center mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-3 ${game.color}`}
                >
                  {game.icon}
                </div>
                <h3 className="text-xl font-semibold">{game.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {game.court}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaClock className="mr-2" />
                {game.time}
              </p>
            </div>
            <button
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
              onClick={() => openBookingForm(game.name)}
            >
              <FaBookmark className="mr-2" />
              Book Now
            </button>
          </div>
        ))}
      </section>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          {/* <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setSidebarOpen(false)}
          /> */}
          <div className="relative bg-white w-80 h-full shadow-lg p-6 flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Profile Section */}
            <div className="flex flex-col items-center mb-6 mt-4 pr-3">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 w-full h-full" />
                  )}
                </div>
                {/* Edit Button */}
                <button
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="absolute bottom-0 left-0 bg-gray-800 text-white px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 hover:bg-gray-700 shadow-md"
                >
                  <FaPencilAlt className="w-3 h-3" /> Edit
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute mt-2 top-full right-0 w-40 bg-white rounded-md shadow-lg border z-10">
                    <label
                      htmlFor="profile-upload"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Upload a photo
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />

                    <button
                      onClick={handleRemoveProfilePicture}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Remove photo
                    </button>
                  </div>
                )}
              </div>

              <h2 className="font-bold text-xl text-gray-800">{username}</h2>
              <p className="text-sm text-gray-500">
                @{username.replace(/\s+/g, "").toLowerCase()}
              </p>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <FaCalendarAlt className="mr-2" />
                {email}
              </p>
            </div>

            <hr className="my-4" />

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              <button className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800">
                <FaUserCircle className="mr-3 text-indigo-600" />
                <span>Profile</span>
              </button>
              <button className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800">
                <FaHistory className="mr-3 text-indigo-600" />
                <span>Booking History</span>
              </button>
              <button className="flex items-center text-left p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-300 text-gray-800">
                <FaCog className="mr-3 text-indigo-600" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-left p-3 hover:bg-red-50 rounded-lg transition-colors duration-300 text-red-600 mt-4"
              >
                <FaSignOutAlt className="mr-3" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}
      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600" />
              Book {selectedGame} Court
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={username}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time Slot
                </label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>7:00 AM - 8:00 AM</option>
                  <option>8:00 AM - 9:00 AM</option>
                  <option>5:00 PM - 6:00 PM</option>
                  <option>6:00 PM - 7:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of Players
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
