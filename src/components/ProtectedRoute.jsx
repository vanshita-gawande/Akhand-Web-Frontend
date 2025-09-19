// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, role }) {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   if (!token) return <Navigate to="/" replace />;
//   if (role && user.role !== role) return <Navigate to="/" replace />;

//   return children;
// }

// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");
  const oneHour = 60 * 60 * 1000; // 1 hour
  const now = Date.now();

  // if no token OR expired → redirect
  if (!token || !loginTime || now - parseInt(loginTime, 10) > oneHour) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    return <Navigate to="/" replace />; // 👈 redirect to homepage
  }

  return children; // if valid → show page
};

export default ProtectedRoute;
