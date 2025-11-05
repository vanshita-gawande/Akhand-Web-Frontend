import { Navigate } from "react-router-dom";

  const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const loginTime = localStorage.getItem("loginTime");
  const oneHour = 60 * 60 * 1000; // 1 hour
  const now = Date.now();

  // if no token OR expired → redirect
  if (!token || !loginTime || now - parseInt(loginTime, 10) > oneHour) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    return <Navigate to="/" replace />;
  }

  // role check
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
