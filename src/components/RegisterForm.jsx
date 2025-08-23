import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { registerUser } from "../api";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// utils/phoneRules.js
export const phoneRules = {
  IN: 10, // India: 10 digits
  US: 10, // USA: 10 digits
  GB: 10, // UK: 10 digits
  AE: 9, // UAE: 9 digits
  // add more countries as needed
};

export default function RegisterForm({ onSuccess, onSwitch, onClose }) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
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
  const [showPopup, setShowPopup] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // ✅ Check password rules
  const checkPassword = (password) => {
    const rules = {
      capital: !/[A-Z]/.test(password),
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

    if (field === "firstName") {
      if (value.trim().length < 2) {
        message = "Enter your first name";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        message = "First name can only contain letters and spaces";
      }
    }

    if (field === "lastName") {
      if (value.trim() !== "" && !/^[A-Za-z]+$/.test(value)) {
        message = "Last name can only contain letters A–Z or a–z";
      }
    }

    if (field === "email") {
      if (!value.includes("@")) message = "Email must include '@'";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        message = "Enter a valid domain (example.com)";
    }

    if (field === "mobile") {
      if (!value) {
        message = "Mobile number is required";
      } else {
        try {
          const phoneNumber = parsePhoneNumberFromString(
            value,
            allValues.country.toUpperCase()
          );
          if (!phoneNumber || !phoneNumber.isValid()) {
            message = `Enter a valid mobile number for ${allValues.country.toUpperCase()}`;
          }
        } catch {
          message = `Enter a valid mobile number for ${allValues.country.toUpperCase()}`;
        }
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
    // allow only aplabetic characters
    if (field === "name") {
      value = value.replace(/[^A-Za-z]/g, "");
    }

    const updatedValues = { ...values, [field]: value };
    setValues(updatedValues);

    const errorMsg = validateField(field, value, updatedValues);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 fresh validation
    const newErrors = {};
    Object.entries(values).forEach(([field, value]) => {
      newErrors[field] = validateField(field, value, values);
    });
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(
      (msg) => msg && msg.length > 0
    );
    if (hasErrors) return; // ❌ block if validation fails

    setLoading(true);
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName || "",
        email: values.email,
        mobile: values.mobile,
        password: values.password,
      };

      const res = await registerUser(payload);

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      setRegistrationSuccess(true);
      setShowPopup(true);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (registrationSuccess) {
      onSuccess?.();
    }
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
          {/* Full Name */}
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
                const formatted = phone.startsWith("+") ? phone : `+${phone}`;
                const countryCode = country?.countryCode || "in";

                // ✅ Use libphonenumber-js to extract national number safely
                const parsed = parsePhoneNumberFromString(
                  formatted,
                  countryCode.toUpperCase()
                );
                let nationalNumber = "";
                if (parsed) {
                  nationalNumber = parsed.nationalNumber || "";
                }

                // ✅ Apply phoneRules length
                const requiredLen = phoneRules[countryCode.toUpperCase()] || 15;
                if (nationalNumber.length > requiredLen) {
                  return; // block extra digits
                }

                setDialCode(country?.dialCode || "");
                const updatedValues = {
                  ...values,
                  country: countryCode,
                  mobile: formatted,
                };
                setValues(updatedValues);

                const errorMsg = validateField(
                  "mobile",
                  formatted,
                  updatedValues
                );
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
              onClick={handlePopupClose}
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
