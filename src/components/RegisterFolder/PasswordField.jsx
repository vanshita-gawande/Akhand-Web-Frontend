// PasswordFields.jsx

export default function PasswordFields({
  values,
  errors,
  handleChange,
  passwordSuggestions,
  showPasswordSuggestions,
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
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onFocus={() => setShowPasswordSuggestions(true)}
            onBlur={() => setShowPasswordSuggestions(false)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
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
