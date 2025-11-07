import { Navigate } from "react-router-dom";
// What is ProtectedRoute? It’s a wrapper component that protects certain pages so only:logged-in users can access them,users with correct role can access them,non-expired sessions can access them , craete here and used at main file where all childerns are routed
const ProtectedRoute = ({ children, role }) => {
  // childern : pages we want to protect,role : ex admin
  // A token is a special string (piece of data) that the backend sends to the frontend after a user successfully logs in.it likes didgital id crad , it isgeneration after validation of email + pass & after confirms identitty  , it stays until logiut or removes from local storage and it is exacytly used for backforth and it help to persisste user data during reload , open new tab
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const loginTime = localStorage.getItem("loginTime");
  const oneHour = 60 * 60 * 1000; // 1 hour
  const now = Date.now();

  // if no token OR expired or time > 1 hr → redirect
  if (!token || !loginTime || now - parseInt(loginTime, 10) > oneHour) {
    localStorage.removeItem("token"); // clean the olde data
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    return <Navigate to="/" replace />; // unauthorised user send thme to login/home page
  }

  // role check -> everey page require certain role ans user.role return role from backend if not match naviagte home like during reg we set role and when try to login in again at thta time
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
// [Login]
//    |
// Backend verifies user
//    |
// Creates JWT token
//    |
// Sends token to frontend
//    |
// Frontend stores in localStorage
//    |
// User can open protected pages
// ProtectedRoute is a higher-order wrapper component that enforces authentication and authorization logic on top of React Router pages. It verifies that a valid token and session timestamp exist in localStorage and checks for expiration. It also enforces role-based access control. If checks fail, it redirects the user to the home page. Otherwise, it renders the protected child component.
