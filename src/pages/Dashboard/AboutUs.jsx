// import React from "react";
// import { FaTrophy, FaGlobe, FaHandshake } from "react-icons/fa";

// export default function AboutUs() {
//   return (
//     <section className="relative py-20 px-6 overflow-hidden">
//       {/* Soft gradient background with decorative blur circles */}
//       <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-purple-50" />
//       <div className="absolute top-20 left-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-40" />
//       <div className="absolute bottom-20 right-10 w-56 h-56 bg-pink-200 rounded-full blur-3xl opacity-40" />

//       <div className="max-w-[1100px] mx-auto text-center space-y-12">
//         {/* Heading */}
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
//           About{" "}
//           <span className="text-indigo-600 font-extrabold">Akhand Sports</span>
//         </h2>
//         <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
//           We believe sports is more than a game — it’s about passion,
//           performance, and progress.{" "}
//           <span className="font-medium text-indigo-600">Akhand Sports</span>{" "}
//           provides innovative tools for athletes, coaches, and organizations to
//           achieve excellence together.
//         </p>

//         {/* Feature Highlights */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           <div className="p-6 rounded-xl bg-gradient-to-br from-white to-indigo-50 shadow-md hover:shadow-lg transition">
//             <FaTrophy className="text-indigo-600 text-3xl mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-800">Our Mission</h3>
//             <p className="text-gray-600 mt-2">
//               To make sports management{" "}
//               <span className="font-semibold">smarter and simpler</span> for
//               everyone.
//             </p>
//           </div>

//           <div className="p-6 rounded-xl bg-gradient-to-br from-white to-purple-50 shadow-md hover:shadow-lg transition">
//             <FaGlobe className="text-purple-600 text-3xl mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-800">Our Vision</h3>
//             <p className="text-gray-600 mt-2">
//               Building{" "}
//               <span className="font-semibold">global sports communities</span>{" "}
//               through innovation and technology.
//             </p>
//           </div>

//           <div className="p-6 rounded-xl bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg transition">
//             <FaHandshake className="text-pink-600 text-3xl mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-800">Our Values</h3>
//             <p className="text-gray-600 mt-2">
//               Integrity, teamwork, and{" "}
//               <span className="font-semibold">innovation</span> in every step we
//               take.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// src/pages/Dashboard/AboutUs.jsx
import React from "react";
import { FaTrophy, FaGlobe, FaHandshake } from "react-icons/fa";

export default function AboutUs({ companyName = "Akhand Sports" }) {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Soft gradient background with decorative blur circles */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-purple-50" />
      <div className="absolute top-20 left-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-pink-200 rounded-full blur-3xl opacity-40" />

      <div className="max-w-[1100px] mx-auto text-center space-y-12">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          About{" "}
          <span className="text-indigo-600 font-extrabold">{companyName}</span>
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We believe sports is more than a game — it’s about passion,
          performance, and progress.{" "}
          <span className="font-medium text-indigo-600">{companyName}</span>{" "}
          provides innovative tools for athletes, coaches, and organizations to
          achieve excellence together.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-gradient-to-br from-white to-indigo-50 shadow-md hover:shadow-lg transition">
            <FaTrophy className="text-indigo-600 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Our Mission</h3>
            <p className="text-gray-600 mt-2">
              To make sports management{" "}
              <span className="font-semibold">smarter and simpler</span> for
              everyone.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-white to-purple-50 shadow-md hover:shadow-lg transition">
            <FaGlobe className="text-purple-600 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Our Vision</h3>
            <p className="text-gray-600 mt-2">
              Building{" "}
              <span className="font-semibold">global sports communities</span>{" "}
              through innovation and technology.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-white to-pink-50 shadow-md hover:shadow-lg transition">
            <FaHandshake className="text-pink-600 text-3xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Our Values</h3>
            <p className="text-gray-600 mt-2">
              Integrity, teamwork, and{" "}
              <span className="font-semibold">innovation</span> in every step we
              take.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
