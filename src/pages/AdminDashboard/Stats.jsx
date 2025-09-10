import { FaUsers, FaClipboardList } from "react-icons/fa";

export default function Stats() {
  return (
    <section className="py-10 px-4 bg-gray-50">
      {/* Centered Heading */}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Overview
      </h2>

      {/* Cards container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <FaUsers className="text-4xl text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
            <p className="text-gray-600">120</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <FaClipboardList className="text-4xl text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Active Sessions
            </h3>
            <p className="text-gray-600">15</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <FaUsers className="text-4xl text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Admins</h3>
            <p className="text-gray-600">3</p>
          </div>
        </div>
      </div>
    </section>
  );
}
