// PhoneField.jsx
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const phoneRules = {
  IN: 10,
  US: 10,
  GB: 10,
  AE: 9,
};

export default function PhoneField({ values, errors, onMobileChange }) {
  return (
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

          const parsed = parsePhoneNumberFromString(
            formatted,
            countryCode.toUpperCase()
          );
          let nationalNumber = "";
                          if (parsed) {
                             nationalNumber = parsed.nationalNumber || "";
                          }

          const requiredLen = phoneRules[countryCode.toUpperCase()] || 15;
          if (nationalNumber.length > requiredLen) return;

          onMobileChange(formatted, country);
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
  );
}
