import { useEffect, useState } from "react";
import { getSuperAdminOverview } from "../../api";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuperAdminOverview()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching overview:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-600">Loading system stats...</p>;
  if (!stats) return <p className="text-red-500">Failed to load overview data</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4">📊 System Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl text-center">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl text-center">
          <h2 className="text-lg font-semibold">Admins</h2>
          <p className="text-2xl font-bold">{stats.totalAdmins}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl text-center">
          <h2 className="text-lg font-semibold">Bookings</h2>
          <p className="text-2xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-xl text-center">
          <h2 className="text-lg font-semibold">Venues</h2>
          <p className="text-2xl font-bold">{stats.totalVenues}</p>
        </div>
      </div>
    </div>
  );
}
