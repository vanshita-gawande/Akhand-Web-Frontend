import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";//API function that sends login request to backend.

export default function LoginForm({ onSuccess, onSwitch, onClose }) { // onsucess:callabck to run when login succesds what to do further , onswitch to switch for register form , to close model
  const [loading, setLoading] = useState(false);// represent is the login req currently being processed and initally false bcz user had nt clicked sign in yet becomes true when user clicks sign in , it will set to true when req is in progress
  const [values, setValues] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});// holds the errors from email,pass,form field
  const [showPopup, setShowPopup] = useState(false);
  const [redirectRole, setRedirectRole] = useState(null);// used to redirect base on role(admin/user/superadmin)
  const navigate = useNavigate();// to redirect using userdom

  // check validation for emails and password
  function validate() {
    const e = {};
    if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      e.email = "Enter a valid email";
    if (values.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  //stops and wait till validation executes i.e stop page refresh and runs validation
  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const data = await loginUser({
        // takls to backend after submit form loginUser() sends the login info to your server. and server checks does mail exists in db , is pass correct , does role match,etc
        // try to login via api
        email: values.email,
        password: values.password,
        role: values.role,
      });

      console.log("✅ Login response:", data);

      //  if user success at login Save token and user info to local storage so user stays even after refresh
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      localStorage.setItem("username", data.user?.firstName || "User");
      localStorage.setItem("email", data.user?.email || "");
      localStorage.setItem("loginTime", Date.now().toString());

      // Save role to redirect after popup so redirect to page on basis of role
      setRedirectRole(data.user.role);

      // Show success popup
      setShowPopup(true);
    } catch (err) { // catch api errors and display backend messages
      setErrors((prev) => ({
        ...prev,
        form: err.response?.data?.message || "Login failed",
      }));
    } finally {
      setLoading(false);// stop loader
    }
  }
//continue after popup and redirect to the page as role selected by user
  const handleContinue = () => {
    setShowPopup(false);
    onSuccess?.();
    if (redirectRole === "superadmin") navigate("/superadmin/dashboard");
    else if (redirectRole === "admin") navigate("/admindashboard");
    else navigate("/userdashboard");
  };

  return (
    <>
      <div className="max-w-md w-full mx-auto mt-8 p-5 bg-white/90 backdrop-blur rounded-2xl shadow-md border border-gray-200 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ✕
          </button>
        )}

        <h2 className="text-2xl font-bold text-purple-700 mb-5 text-center">
          Sign In
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Role selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              value={values.role}
              onChange={(e) => setValues({ ...values, role: e.target.value })}
              className="w-full px-2 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-gray-700 appearance-none text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
              value={values.email}
              onChange={(e) =>
                setValues((v) => ({ ...v, email: e.target.value }))
              }
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-300 transition`}
              value={values.password}
              onChange={(e) =>
                setValues((v) => ({ ...v, password: e.target.value }))
              }
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Form-level error */}
          {errors.form && (
            <p className="text-red-500 text-sm mt-1 text-center">
              {errors.form}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-40 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {/* use here loading and set loading use state */}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Switch to Register */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-purple-700 font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full">
            <h3 className="text-xl font-bold text-green-600 mb-2">
              Login Successful
            </h3>
            <p className="text-gray-700 mb-4">Welcome back!</p>
            <button
              onClick={handleContinue}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
// LoginForm is a controlled component that manages email, password, and role fields using React state. On submit, it validates input, sends a login request via an API function, stores authentication data in localStorage, and displays a success modal. Based on user roles, it navigates to different dashboards. It provides UX feedback such as inline error messages and loading indicators.