import basketballImg from "../assets/basketball.avif";
import footballImg from "../assets/football.avif";
import stadium from "../assets/stadium.avif";

export default function Dashboard() {
  return (
    <main className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-12 mt-6">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row gap-8 relative">
        {/* Left Text */}
        <div className="lg:w-2/5 flex flex-col gap-4 z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
              Welcome
            </span>{" "}
            to Akhand Sports
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Akhand Sports is your ultimate destination for managing{" "}
            <strong className="text-indigo-600">sports activities</strong>,{" "}
            <strong className="text-indigo-600">events</strong>, and{" "}
            <strong className="text-indigo-600">player stats</strong>. Organize
            tournaments, track performances, and stay updated with matches.
          </p>
          <p className="flex flex-wrap gap-2 text-gray-600">
            {["Football", "Basketball", "Tennis", "Cricket"].map((tag) => (
              <span
                key={tag}
                className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
              >
                {tag}
              </span>
            ))}
          </p>
          <p className="text-gray-800 font-semibold mt-2">
            Join us to unlock analytics, participate in events, and be part of a
            thriving sports ecosystem!
          </p>
        </div>

        {/* Right Images Grid - Staggered Layout */}
        <div className="lg:w-3/5 grid grid-cols-3 gap-3 rounded-xl overflow-hidden">
          {/* Big Basketball Image (2/3 width) */}
          <div className="col-span-2 row-span-2 relative overflow-hidden rounded-xl shadow-md">
            <img
              src={basketballImg}
              alt="Basketball"
              className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
            />
          </div>

          {/* Football (top-right) */}
          <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md">
            <img
              src={footballImg}
              alt="Football"
              className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
            />
          </div>

          {/* Stadium (bottom-right) */}
          <div className="col-span-1 relative overflow-hidden rounded-xl shadow-md">
            <img
              src={stadium}
              alt="Stadium"
              className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
