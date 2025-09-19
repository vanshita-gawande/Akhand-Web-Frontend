// src/pages/AdminDashboard/VenueModal.jsx
import { eachHourOfInterval, format } from "date-fns";
import { Listbox } from "@headlessui/react";
import { useState, useEffect } from "react";

export default function VenueModal({
  formData,
  onChange,
  onSubmit,
  editingVenue,
  onClose,
}) {
  // Generate 24-hour slots (midnight → 11 PM)
  const hours = eachHourOfInterval({
    start: new Date(2023, 0, 1, 0),
    end: new Date(2023, 0, 1, 23),
  }).map((date) => ({
    value: format(date, "HH:mm"),
    label: format(date, "h a"),
  }));

  // Local states synced with formData
  const [opening, setOpening] = useState(formData.openingTime || "");
  const [closing, setClosing] = useState(formData.closingTime || "");
  const [price, setPrice] = useState(formData.price || "");

  // Update local state whenever formData changes (e.g., when editing)
  useEffect(() => {
    setOpening(formData.openingTime || "");
    setClosing(formData.closingTime || "");
    setPrice(formData.price || "");
  }, [formData]);

  // Sync changes back to parent
  const handleChange = (name, value) => {
    onChange({ target: { name, value } });
    if (name === "openingTime") setOpening(value);
    if (name === "closingTime") setClosing(value);
    if (name === "price") setPrice(value);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative pb-16">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          {editingVenue ? "Update Venue" : "Venue Registration"}
        </h2>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Sport */}
          <input
            type="text"
            name="sport"
            value={formData.sport}
            onChange={onChange}
            placeholder="Sport (e.g. Football, Basketball)"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          {/* Venue Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Venue Name"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="Location"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          {/* Capacity */}
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={onChange}
            placeholder="Capacity"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            min="0"
            required
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          {/* Opening & Closing */}
          <div className="grid grid-cols-2 gap-4">
            {/* Opening */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Opening Time
              </label>
              <Listbox
                value={opening}
                onChange={(val) => handleChange("openingTime", val)}
              >
                <div className="relative">
                  <Listbox.Button className="w-full p-3 border rounded-xl bg-white shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-purple-400">
                    {opening
                      ? hours.find((h) => h.value === opening)?.label
                      : "Select Opening"}
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto z-50">
                    {hours.map((h) => (
                      <Listbox.Option
                        key={h.value}
                        value={h.value}
                        className={({ active }) =>
                          `cursor-pointer px-4 py-2 ${
                            active ? "bg-purple-100" : ""
                          }`
                        }
                      >
                        {h.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Closing */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Closing Time
              </label>
              <Listbox
                value={closing}
                onChange={(val) => handleChange("closingTime", val)}
              >
                <div className="relative">
                  <Listbox.Button className="w-full p-3 border rounded-xl bg-white shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-purple-400">
                    {closing
                      ? hours.find((h) => h.value === closing)?.label
                      : "Select Closing"}
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg max-h-40 overflow-y-auto z-50">
                    {hours.map((h) => (
                      <Listbox.Option
                        key={h.value}
                        value={h.value}
                        className={({ active }) =>
                          `cursor-pointer px-4 py-2 ${
                            active ? "bg-purple-100" : ""
                          }`
                        }
                      >
                        {h.label}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>

          {/* Price */}
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="Price (₹/hr)"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            min="0"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className={`w-full p-3 rounded-xl text-white transition ${
              editingVenue
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {editingVenue ? "Update Venue" : "Register Venue"}
          </button>
        </form>
      </div>
    </div>
  );
}
