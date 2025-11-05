// PasswordFields.jsx

export default function PasswordFields({
  // receives many props from its parents
  values, // current snapshot of form fields.
  errors, // field-wise errors validation
  handleChange, //updates input values
  passwordSuggestions,// which pass rule failed
  showPasswordSuggestions,// boolean to show/hide suggestions
  setShowPasswordSuggestions,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) {
  return (
    <>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // if click  showpass button then shows plain text else masked pass input
            placeholder="••••••••" // suggests pass lengthnvirtually
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
            value={values.password} // controlled componenet values came from react state
            onChange={(e) => handleChange("password", e.target.value)}//update pass
            onFocus={() => setShowPasswordSuggestions(true)}
            onBlur={() => setShowPasswordSuggestions(false)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
            // p is just a parameter name (short for “previous” or “prev”).It represents the previous state value.
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {showPasswordSuggestions && (
          <ul className="text-sm mt-1 space-y-1">
            {passwordSuggestions.capital && (
              <li className="text-red-500">
                Must include at least one uppercase letter
              </li>
            )}
            {passwordSuggestions.number && (
              <li className="text-red-500">Must include at least one number</li>
            )}
            {passwordSuggestions.special && (
              <li className="text-red-500">Must include one special char</li>
            )}
            {passwordSuggestions.length && (
              <li className="text-red-500">
                Password must be at least 8 characters
              </li>
            )}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.confirm ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
            value={values.confirm}
            onChange={(e) => handleChange("confirm", e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
            onClick={() => setShowConfirmPassword((p) => !p)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirm && (
          <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
        )}
      </div>
    </>
  );
}
//  everytime when value update follow this 
// When typing:

// onChange fires
// handleChange runs
// values object gets updated
// component re-renders
// input displays new value
// validateField checks rules
// errors state updates
// UI shows error message/red borders
// This is the controlled form pattern.
// The PasswordFields component is a reusable controlled form component that renders password and confirm password inputs. It receives form values, error messages, and visibility toggles from its parent. It provides real-time validation feedback, password strength suggestions, and user-friendly show/hide toggles. The component conditionally renders suggestions and error messages based on state, and styling changes dynamically using Tailwind to visually indicate errors. All state updates occur through controlled props, keeping business logic centralized and UI stateless.