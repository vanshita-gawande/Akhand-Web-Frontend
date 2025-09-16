import { useEffect, useState } from "react";
import { FaUsers, FaClipboardList } from "react-icons/fa";
import { getStats } from "../../api"; // adjust path if needed

// Animate numbers from `from` to `to`
function animateValue(from, to, setter, duration = 700) {
  const diff = to - from;
  if (diff === 0) {
    setter(to);
    return;
  }
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const current = Math.floor(from + diff * progress);
    setter(current);
    if (progress < 1) window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}

export default function Stats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    admins: 0,
  });
  const [display, setDisplay] = useState({
    totalUsers: 0,
    totalBookings: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null); // reset previous errors
      try {
        const data = await getStats(); // fetch stats from backend

        // Validate data and default to 0 if missing
        const totalUsers =
          typeof data.totalUsers === "number" ? data.totalUsers : 0;
        const totalBookings =
          typeof data.totalBookings === "number" ? data.totalBookings : 0;
        const admins = typeof data.admins === "number" ? data.admins : 0;

        setStats({ totalUsers, totalBookings, admins });

        // Animate numbers
        animateValue(0, totalUsers, (v) =>
          setDisplay((d) => ({ ...d, totalUsers: v }))
        );
        animateValue(0, totalBookings, (v) =>
          setDisplay((d) => ({ ...d, totalBookings: v }))
        );
        animateValue(0, admins, (v) =>
          setDisplay((d) => ({ ...d, admins: v }))
        );
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-10 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Overview
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <FaUsers className="text-4xl text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
            <p className="text-gray-600">{display.totalUsers}</p>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <FaClipboardList className="text-4xl text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Total Bookings
            </h3>
            <p className="text-gray-600">{display.totalBookings}</p>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <FaUsers className="text-4xl text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Admins</h3>
            <p className="text-gray-600">{display.admins}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mt-4 text-center text-red-600">
          {error}
        </div>
      )}
    </section>
  );
}
