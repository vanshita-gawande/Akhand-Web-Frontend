// EmailField.jsx
import React from "react"; // Imports React so JSX can compile.

export default function EmailField({ values, errors, handleChange }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">Email</label>
      <input
        type="email"
        placeholder="you@example.com"
        // shows the helper text when there's an error
        className={`w-full px-4 py-2.5 rounded-lg border ${
          errors.email ? "border-red-500" : "border-gray-300" // conditional class  if there is an error show red else gray border
        } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)} // whenever user types this function get called
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
      )}
    </div>
  );
}
/* ✅ Where does EmailField.jsx fit?

It plays the presentation role:
shows label
shows input
shows error text
applies red border if errors.email
All logic lives outside (in your validator + handler).
This is called controlled component pattern 
This form uses controlled components in React. Every input change triggers handleChange, which first normalizes the value, updates the form state, and then calls validateField to run field-specific validation logic. The resulting error message is stored in a central errors state object. The UI component (EmailField.jsx) reads from values.email to display the current value and from errors.email to conditionally render real-time feedback and style changes.*/
