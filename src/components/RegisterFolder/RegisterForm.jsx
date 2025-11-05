// RegisterForm.jsx
import { useState } from "react"; // hook let u store value that can chnage overtime for ex form inputs
import { parsePhoneNumberFromString } from "libphonenumber-js"; //comes from libraray that format,valisate phone numbers nad extract national  numbers and country code
import validator from "validator"; //genral purpose validation libraray which gives readymade validate function ex .validtaor.isemail(), isurl()etc
import { registerUser } from "../../api"; //import function to send backend post req

import PersonalName from "./PersonalName";
import EmailField from "./EmailField";
import PhoneField from "./PhoneField";
import PasswordFields from "./PasswordField";
import SuccessPopup from "./SuccessPopup";

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
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [passwordSuggestions, setPasswordSuggestions] = useState({
    capital: true,
    number: true,
    special: true,
    length: true,
  });
  const [showPasswordSuggestions, setShowPasswordSuggestions] = useState(false); //used to show which pass field failed
  const [dialCode, setDialCode] = useState("91");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // hide/show buttons
  const [registrationSuccess, setRegistrationSuccess] = useState(false); //controls popup ui
  const phoneRules = { IN: 10, US: 10, GB: 10, AE: 9 };
  //pass checker ,update ui rules instantly that rule goes as we type correct pass , return boolean
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

  // main validation func validation rules and pass in validate filed to check and render errors when something wrong get typed called everytime when usertyes in any of field
  const validateField = (field, value, allValues = values) => {
    let message = "";
    if (field === "firstName") {
      if (value.trim().length < 2) message = "Enter your first name";
      else if (!/^[a-zA-Z\s]+$/.test(value))
        message = "First name can only contain letters and spaces";
    }
    if (field === "lastName") {
      if (value.trim() !== "" && !/^[A-Za-z]+$/.test(value))
        message = "Last name can only contain letters A–Z or a–z";
    }
    if (field === "email") {
      const trimmed = value.trim();
      if (!validator.isEmail(trimmed)) message = "Enter a valid email address";
      else if (/[A-Z]/.test(trimmed))
        message = "Email must be in lowercase only";
      else {
        const [localPart, domain] = trimmed.split("@");
        const lowerDomain = domain.toLowerCase();
        const allowedDomains = [
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "hotmail.com",
          "icloud.com",
          "yourcompany.com",
          "othercompany.com",
        ];
        if (!allowedDomains.includes(lowerDomain))
          message =
            "Only Gmail, Yahoo, Outlook, iCloud, or authorized company emails are allowed";
        else message = null;
      }
    }
    if (field === "mobile") {
      if (!value) message = "Mobile number is required";
      else {
        try {
          const phoneNumber = parsePhoneNumberFromString(
            value,
            allValues.country.toUpperCase()
          );
          if (!phoneNumber || !phoneNumber.isValid())
            message = `Enter a valid mobile number for ${allValues.country.toUpperCase()}`;
          else if (allValues.country.toUpperCase() === "IN") {
            const nationalNumber = phoneNumber.nationalNumber || "";
            if (!/^[7-9]\d{9}$/.test(nationalNumber))
              message = "Indian mobile numbers must start with 7, 8, or 9";
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

  // genral fun to handle inp This updates values from empty → currently typed value,Triggers re-render
  const handleChange = (field, value) => {
    if (field === "mobile") value = value.replace(/\D/g, "");
    if (field === "name") value = value.replace(/[^A-Za-z]/g, "");
    const updatedValues = { ...values, [field]: value }; // whenver user types values udate fro here
    setValues(updatedValues); //merge and update values and trigger react to rerender
    const errorMsg = validateField(field, value, updatedValues); // everythig valiadte here each filed from form , filed here determine which validation rule to run , value -> the current typed text , updatedvalue -> needed for cross field validation like confirm password , everytime it return something which need to be store so the new value store here on basis of it gives the msg to show in ui
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };
  // Gets a (phone, country) object from react-phone-input-2
  const handleMobileChange = (phone, country) => {
    const formatted = phone.startsWith("+") ? phone : `+${phone}`;
    const countryCode = country?.countryCode || "in";
    const parsed = parsePhoneNumberFromString(
      formatted,
      countryCode.toUpperCase()
    );
    let nationalNumber = parsed?.nationalNumber || "";
    const requiredLen = phoneRules[countryCode.toUpperCase()] || 15;
    if (nationalNumber.length > requiredLen) return;
    setDialCode(country?.dialCode || "");
    const updatedValues = {
      ...values,
      country: countryCode,
      mobile: formatted,
    };
    setValues(updatedValues);
    const errorMsg = validateField("mobile", formatted, updatedValues);
    setErrors((prev) => ({ ...prev, mobile: errorMsg }));
  };
  //whenver submit button click react calls this
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the browser from doing its built-in form submit behavior (page reload).
    const newErrors = {};
    Object.entries(values).forEach(([field, value]) => {
      //validate one more time
      newErrors[field] = validateField(field, value, values);
    }); // it carries the error message from all filed if fild has no error it will be null , if any error then error message must be in array so if error stop
    setErrors(newErrors); // shows errors if any
    if (Object.values(newErrors).some((msg) => msg && msg.length > 0)) return; //if nay error found stop here, Is there ANY error message with length greater than 0? , .some ideal here because one error to reject submission no need to check whole array manualyy . .some() is a built-in JavaScript array method. , Does at least one item in this array pass the test? and here if error msg then it pass test

    setLoading(true);
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName || "",
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        role: values.role,
      };
      const res = await registerUser(payload);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("username", res.user.firstName || "User");
        localStorage.setItem("email", res.user.email || "");
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
    if (registrationSuccess) onSuccess?.();
  };

  return (
    <>
      <div className="max-w-lg w-full mx-auto mt-6 p-3.5 bg-white/90 backdrop-blur rounded-xl shadow-md border border-gray-200 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ✕
          </button>
        )}

        <h2 className="text-lg font-bold text-purple-700 mb-3 text-center">
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl 
             bg-gradient-to-br"
        >
          {/* Role Selector */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-purple-700 mb-1">
              Role
            </label>
            <select
              value={values.role}
              //... value Copy the old data, and update role only , bcz we are updating only one field role so remaiang data amust not get lost hence ..value to store old data and update with target value without unchnage
              onChange={(e) => setValues({ ...values, role: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-purple-300 text-gray-700 text-sm
                 focus:outline-none focus:ring-2 focus:ring-purple-400
                 bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Personal Name */}
          <PersonalName
            values={values}
            errors={errors}
            handleChange={handleChange}
            inputClass="w-full px-3 py-2.5 rounded-lg border border-purple-300 text-gray-700 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400
                bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100"
          />

          {/* Email */}
          <EmailField
            values={values}
            errors={errors}
            handleChange={handleChange}
            inputClass="w-full px-3 py-2.5 rounded-lg border border-purple-300 text-gray-700 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400
                bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100"
          />

          {/* Phone */}
          <PhoneField
            values={values}
            errors={errors}
            onMobileChange={handleMobileChange}
            phoneRules={phoneRules}
            inputClass="w-full px-3 py-2.5 rounded-lg border border-purple-300 text-gray-700 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400
                bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100"
          />

          {/* Passwords */}
          <PasswordFields
            values={values}
            errors={errors}
            handleChange={handleChange}
            passwordSuggestions={passwordSuggestions}
            showPasswordSuggestions={showPasswordSuggestions}
            setShowPasswordSuggestions={setShowPasswordSuggestions}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            inputClass="w-full px-3 py-2.5 rounded-lg border border-purple-300 text-gray-700 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400
                bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100"
          />

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-44 py-2.5 font-bold rounded-lg shadow-md text-white text-sm
                 bg-gradient-to-r from-purple-500 to-purple-700
                 hover:from-purple-600 hover:to-purple-800 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-gray-600 text-sm">
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

      <SuccessPopup
        showPopup={showPopup}
        registrationSuccess={registrationSuccess}
        handlePopupClose={handlePopupClose}
      />
    </>
  );
}
// This form uses React’s controlled component pattern. All input values are stored in a central values state object, and all errors are stored in errors. Each input’s onChange handler updates state and triggers real-time validation using validateField. Phone validation leverages libphonenumber-js to enforce country-specific rules. Password strength is dynamically analyzed and shown to the user. On submit, every field is revalidated, and an API request is sent through registerUser. On success, a popup is displayed, and user authentication data is stored in localStorage. The UI is split into reusable input components for cleaner structure and scalability.
