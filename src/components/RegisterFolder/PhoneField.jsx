// PhoneField.jsx
import PhoneInput from "react-phone-input-2";//a popular React component for international phone input
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";// helps to validate and extract country + national number using official rules

const phoneRules = {
  // Defines required national number lengths by country code.
  IN: 10,
  US: 10,
  GB: 10,
  AE: 9,
};

export default function PhoneField({ values, errors, onMobileChange // callback to update parent state
 }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        Mobile Number
      </label>
      <PhoneInput
        country={values.country} // control default flg which is india here
        value={values.mobile} // value make it controll component
        onChange={(phone, country) => {
          const formatted = phone.startsWith("+") ? phone : `+${phone}`;
          const countryCode = country?.countryCode || "in"; // default to 'in' if country undefined

          const parsed = parsePhoneNumberFromString(
            // validated based on real phone rules
            formatted,
            countryCode.toUpperCase()
          );
          let nationalNumber = "";
          if (parsed) {
            nationalNumber = parsed.nationalNumber || "";
          }

          const requiredLen = phoneRules[countryCode.toUpperCase()] || 15; // if any country missing then alow upto 15 digits max
          if (nationalNumber.length > requiredLen) return; // Stops user from typing more digits than allowed.

          onMobileChange(formatted, country);// send formateed number to parent and parent update the state
        }}
        inputStyle={{
          width: "100%",
          height: "44px",
          borderRadius: "10px",
          border: errors.mobile ? "1px solid red" : "1px solid #d1d5db",
          paddingLeft: "48px",
        }}
        buttonStyle={{ border: "none", background: "transparent" }}
        disableDropdown={false} // keep country dropdown active
        countryCodeEditable={false} // it prevent user to edit the default country code
      />
      {/* render messag when validation fails */}
      {errors.mobile && (
        <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
      )}
    </div>
  );
}
/* When user types:

onMobileChange(formatted, country) fires
Parent updates:
values.mobile
values.country
Parent calls validateField("mobile"...
If invalid → set errors.mobile
UI renders red border + error text*/
// PhoneField is a controlled input component for international phone numbers. It uses react-phone-input-2 for UI and libphonenumber-js to parse and validate country-specific phone rules. As the user types, the component normalizes the input to E.164 format, extracts the national number, enforces length restrictions based on the selected country, and calls onMobileChange to update state in the parent. Errors are conditionally styled, and feedback is displayed below the field.
