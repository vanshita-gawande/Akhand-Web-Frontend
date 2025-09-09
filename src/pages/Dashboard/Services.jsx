// src/pages/Dashboard/Services.jsx
import React from "react";
import {
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";

const defaultServices = [
  {
    title: "Event Management",
    desc: "Plan and organize tournaments with ease.",
    icon: <FaCalendarAlt className="text-indigo-500 text-3xl" />,
  },
  {
    title: "Player Analytics",
    desc: "Track performance and statistics in real-time.",
    icon: <FaChartLine className="text-purple-500 text-3xl" />,
  },
  {
    title: "Community Engagement",
    desc: "Connect with fans, players, and coaches.",
    icon: <FaUsers className="text-pink-500 text-3xl" />,
  },
  {
    title: "Revenue Insights",
    desc: "Monitor financials and sponsorship opportunities.",
    icon: <FaMoneyBillWave className="text-green-500 text-3xl" />,
  },
];

export default function Services({
  sectionTitle = "Our Services",
  sectionSubtitle = "Powerful tools designed to make sports management smarter and smoother.",
  services = defaultServices,
}) {
  return (
    <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-white via-indigo-50 to-white">
      {/* Background blur orbs */}
      <div className="absolute top-16 left-16 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-20 w-52 h-52 bg-pink-200 rounded-full blur-3xl opacity-20" />

      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          {sectionTitle.split(" ")[0]}{" "}
          <span className="text-indigo-600">
            {sectionTitle.split(" ").slice(1).join(" ")}
          </span>
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-center">
          {sectionSubtitle}
        </p>

        {/* Service Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {services.map(({ title, desc, icon }, i) => (
            <div
              key={i}
              className="flex items-start gap-5 p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-md hover:shadow-xl transition"
            >
              {/* Icon */}
              <div className="flex-shrink-0 p-3 bg-white rounded-full shadow-md">
                {icon}
              </div>
              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
