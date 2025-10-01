// PersonalName.jsx
import React from "react";

export default function PersonalName({ values, errors, handleChange }) {
  return (
    <div>
      <h3 className="block text-gray-700 font-medium mb-1">Full Name</h3>

      <div className="mb-4">
        <input
          type="text"
          placeholder="First Name"
          className={`w-full px-4 py-2.5 rounded-lg border ${
            errors.firstName ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
          value={values.firstName}
          onChange={(e) => {
            const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, "");
            handleChange("firstName", onlyLetters);
          }}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Last Name (optional)"
          className={`w-full px-4 py-2.5 rounded-lg border ${
            errors.lastName ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
          value={values.lastName}
          onChange={(e) => {
            const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, "");
            handleChange("lastName", onlyLetters);
          }}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
        )}
      </div>
    </div>
  );
}
