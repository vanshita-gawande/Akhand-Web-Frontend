// EmailField.jsx
import React from "react";

export default function EmailField({ values, errors, handleChange }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">Email</label>
      <input
        type="email"
        placeholder="you@example.com"
        className={`w-full px-4 py-2.5 rounded-lg border ${
          errors.email ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
      )}
    </div>
  );
}
