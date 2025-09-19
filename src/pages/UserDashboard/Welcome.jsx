import { FaCalendarCheck } from "react-icons/fa";

export default function Welcome({ username, scrollToGames }) {
  return (
    <>
      {/* Distinct Dashboard Heading */}
      <section className="bg-white py-6 shadow-md">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            User Dashboard
          </h1>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
            Welcome back, <span className="text-green-400">{username}</span>
          </h2>
          <p className="mb-6 text-lg sm:text-xl">
            Ready to book your next game?
          </p>
          <button
            onClick={scrollToGames}
            className="bg-green-500 hover:bg-green-400 transition duration-300 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md flex items-center justify-center mx-auto"
          >
            <FaCalendarCheck className="mr-2" />
            Book Court Below
          </button>
        </div>
      </section>
    </>
  );
}
