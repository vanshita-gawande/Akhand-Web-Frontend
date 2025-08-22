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

  const [dialCode, setDialCode] = useState("91");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ success popup state
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Check password rules
  const checkPassword = (password) => {
    const rules = {
      capital: !/[A-Z]/.test(password), // at least one uppercase
      number: !/[0-9]/.test(password),
      special: !/[!@#$%^&*(),.?":{}|<>]/.test(password),
      length: password.length < 8,
    };
    setPasswordSuggestions(rules);
    return rules;
  };

  const getNationalNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith(dialCode)) {
      return digits.slice(dialCode.length);
    }
    return digits;
  };

  const validateField = (field, value, allValues = values) => {
    let message = "";

    if (field === "name" && value.trim().length < 2)
      message = "Enter your full name";

    if (field === "email") {
      if (!value.includes("@")) message = "Email must include '@'";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        message = "Enter a valid domain (example.com)";
    }

    if (field === "mobile") {
      const national = getNationalNumber(value);
      const requiredLen = phoneRules[allValues.country] || 8;
      if (national.length !== requiredLen) {
        message = `Enter ${requiredLen} digits for ${allValues.country.toUpperCase()}`;
      }
    }

    if (field === "password") {
      const pwErrors = checkPassword(value);
      if (Object.values(pwErrors).some((v) => v))
        message = "Password does not meet all requirements";
    }

    if (field === "confirm" && value !== allValues.password)
      message = "Passwords do not match";

    return message;
  };

  const handleChange = (field, value) => {
    if (field === "mobile") {
      value = value.replace(/\D/g, "");
    }
    const updatedValues = { ...values, [field]: value };
    setValues(updatedValues);

    const errorMsg = validateField(field, value, updatedValues);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 fresh validation here (don’t trust old state)
    const newErrors = {};
    Object.entries(values).forEach(([field, value]) => {
      newErrors[field] = validateField(field, value, values);
    });

    setErrors(newErrors);

    const national = getNationalNumber(values.mobile);
    const requiredLen = phoneRules[values.country] || 8;
    const pwErrors = checkPassword(values.password);

    const hasErrors =
      Object.values(newErrors).some((msg) => msg && msg.length > 0) ||
      national.length !== requiredLen ||
      Object.values(pwErrors).some((v) => v);

    if (hasErrors) return; // ❌ block if validation fails

    // ✅ success flow
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPopup(true); // 🎉 popup shows now
    }, 600);
  };

  return (
    <>
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
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
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
                const digits = phone.replace(/\D/g, "");
                const countryCode = country?.countryCode || "in"; // new country
                setDialCode(country?.dialCode || "");

                // update both country and mobile together
                const updatedValues = {
                  ...values,
                  country: countryCode,
                  mobile: digits,
                };
                setValues(updatedValues);

                // validate mobile with updated country
                const errorMsg = validateField("mobile", digits, updatedValues);
                setErrors((prev) => ({ ...prev, mobile: errorMsg }));
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
              countryCodeEditable={false}
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
                onClick={() => setShowPassword((prev) => !prev)}
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
                  <li className="text-red-500">
                    Must include at least one number
                  </li>
                )}
                {passwordSuggestions.special && (
                  <li className="text-red-500">
                    Must include one special char
                  </li>
                )}
                {passwordSuggestions.length && (
                  <li className="text-red-500">
                    Password must be at least 8 characters
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
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
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
      {/* ✅ Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              Registration Successful
            </h3>
            <p className="text-gray-600 mb-4">
              Your account has been created successfully.
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                onSuccess?.(); // ✅ only fire after popup is dismissed
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
