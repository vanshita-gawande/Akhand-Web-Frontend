import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Country-wise phone length rules
const phoneRules = {
  in: 10,
  us: 10,
  ae: 9,
  fr: 9,
};

export default function RegisterForm({ onSuccess, onSwitch, onClose }) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "in",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordSuggestions, setPasswordSuggestions] = useState({
    capital: true,
    number: true,
    special: true,
    length: true,
  });
  const [showPasswordSuggestions, setShowPasswordSuggestions] = useState(false);

  const checkPassword = (password) => {
    setPasswordSuggestions({
      capital: !/^[A-Z]/.test(password),
      number: !/[0-9]/.test(password),
      special: !/[!@#$%^&*(),.?":{}|<>]/.test(password),
      length: password.length !== 8,
    });
  };

  const validateField = (field, value) => {
    let message = "";

    if (field === "name" && value.trim().length < 2)
      message = "Enter your full name";

    if (field === "email") {
      if (!value.includes("@")) message = "Email must include '@'";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        message = "Enter a valid domain (example.com)";
    }

    if (field === "mobile") {
      const onlyDigits = value.replace(/\D/g, "");
      const requiredLen = phoneRules[values.country] || 8;
      if (onlyDigits.length !== requiredLen) {
        message = `Enter ${requiredLen} digits for ${values.country.toUpperCase()}`;
      }
    }

    if (field === "password") {
      checkPassword(value);
      if (Object.values(passwordSuggestions).some((v) => v))
        message = "Password does not meet all requirements";
    }

    if (field === "confirm" && value !== values.password)
      message = "Passwords do not match";

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (field, value) => {
    if (field === "mobile") value = value.replace(/-/g, "");
    setValues((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Object.entries(values).forEach(([field, value]) =>
      validateField(field, value)
    );

    const hasErrors =
      Object.values(errors).some((e) => e) ||
      Object.values(passwordSuggestions).some((v) => v);

    if (hasErrors) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Registered! (demo)");
      onSuccess?.();
    }, 600);
  };

  return (
    <div className="max-w-lg w-full mx-auto mt-8 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-gray-200 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ✕
        </button>
      )}

      <h2 className="text-2xl font-bold text-purple-700 mb-5 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Akhand User"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Mobile */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mobile Number
          </label>
          <PhoneInput
            country={values.country}
            value={values.mobile}
            onChange={(phone, country) => {
              handleChange("mobile", phone);
              setValues((prev) => ({ ...prev, country: country.countryCode }));
            }}
            inputStyle={{
              width: "100%",
              height: "44px",
              borderRadius: "10px",
              border: errors.mobile ? "1px solid red" : "1px solid #d1d5db",
              paddingLeft: "48px",
            }}
            buttonStyle={{ border: "none", background: "transparent" }}
            disableDropdown={false}
            countryCodeEditable={true}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            onFocus={() => setShowPasswordSuggestions(true)}
            onBlur={() => setShowPasswordSuggestions(false)}
          />
          {showPasswordSuggestions && (
            <ul className="text-sm mt-1 space-y-1">
              {passwordSuggestions.capital && (
                <li className="text-red-500">First letter must be uppercase</li>
              )}
              {passwordSuggestions.number && (
                <li className="text-red-500">
                  Must include at least one number
                </li>
              )}
              {passwordSuggestions.special && (
                <li className="text-red-500">Must include one special char</li>
              )}
              {passwordSuggestions.length && (
                <li className="text-red-500">
                  Password must be exactly 8 characters
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.confirm ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
            value={values.confirm}
            onChange={(e) => handleChange("confirm", e.target.value)}
          />
          {errors.confirm && (
            <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-40 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-gray-600 text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-purple-700 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
