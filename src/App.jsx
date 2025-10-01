// // src/App.jsx
// import { useState } from "react";
// import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
// import Navbar from "./pages/Dashboard/Navbar";
// import LoginForm from "./components/LoginForm";
// import RegisterForm from "./components/RegisterForm";

// // Pages
// import Dashboard from "./pages/Dashboard/Dashboard";
// import UserDashboard from "./pages/UserDashboard/UserDashboard";
// import AdminDashboard from "./pages/AdminDashboard/Admindashboard";

// // // Common Footer
// import Footer from "./CommonFiles/Footer";


// // -----------------------
// // Public layout component
// // -----------------------
// function PublicLayout({ onLoginClick, onRegisterClick }) {
//   return (
//     <>
//       <Navbar onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
//       <section id="home">
//         {/* Pass props to Dashboard so it can open login/register popup */}
//         <Dashboard
//           onLoginClick={onLoginClick}
//           onRegisterClick={onRegisterClick}
//         />
//       </section>
//     </>
//   );
// }

// // -----------------------
// // AppContent
// // -----------------------
// export default function AppContent() {
//   const [authOpen, setAuthOpen] = useState(false);
//   const [authMode, setAuthMode] = useState("login");
//   const navigate = useNavigate();

//   const openLogin = () => {
//     setAuthMode("login");
//     setAuthOpen(true);
//   };

//   const openRegister = () => {
//     setAuthMode("register");
//     setAuthOpen(true);
//   };

//   const closeAuth = () => setAuthOpen(false);
//   const switchMode = (mode) => setAuthMode(mode);

//   // ✅ Check if user is logged in
//   const isAuthenticated = !!localStorage.getItem("token");

//   // ✅ Get role (from saved user object in localStorage)
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const role = user?.role || "user";

//   return (
//     <div className="scroll-smooth">
//       <Routes>
//         {/* ✅ Public Dashboard */}
//         <Route
//           path="/"
//           element={
//             <PublicLayout
//               onLoginClick={openLogin}
//               onRegisterClick={openRegister}
//             />
//           }
//         />

//         {/* ✅ User dashboard */}
//         <Route
//           path="/userdashboard"
//           element={
//             isAuthenticated && role === "user" ? (
//               <UserDashboard />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />

//         {/* ✅ Admin dashboard */}
//         <Route
//           path="/admindashboard"
//           element={
//             isAuthenticated && role === "admin" ? (
//               <AdminDashboard />
//             ) : (
//               <Navigate to="/" replace />
//             )
//           }
//         />
//       </Routes>
//       {/* Footer always visible */}
//       <Footer />

//       {/* ✅ Auth Modal */}
//       {authOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           {authMode === "login" ? (
//             <LoginForm
//               onSuccess={() => {
//                 setAuthOpen(false);

//                 // ✅ Redirect based on role
//                 if (role === "admin") {
//                   navigate("/admindashboard");
//                 } else {
//                   navigate("/userdashboard");
//                 }
//               }}
//               onSwitch={() => switchMode("register")}
//               onClose={closeAuth}
//             />
//           ) : (
//             <RegisterForm
//               onSuccess={() => {
//                 setAuthMode("login"); // after register → login
//               }}
//               onSwitch={() => switchMode("login")}
//               onClose={closeAuth}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


// src/App.jsx
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./pages/Dashboard/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterFolder/RegisterForm";


// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard/Admindashboard";

// Common Footer
import Footer from "./CommonFiles/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// -----------------------
// Public layout component
// -----------------------
function PublicLayout({ onLoginClick, onRegisterClick }) {
  return (
    <>
      <Navbar onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      <section id="home">
        <Dashboard
          onLoginClick={onLoginClick}
          onRegisterClick={onRegisterClick}
        />
      </section>
    </>
  );
}

// -----------------------
// AppContent
// -----------------------
export default function AppContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const navigate = useNavigate();

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  const closeAuth = () => setAuthOpen(false);
  const switchMode = (mode) => setAuthMode(mode);

  return (
    <div className="scroll-smooth">
      <Routes>
        {/* Public Dashboard */}
        <Route
          path="/"
          element={
            <PublicLayout
              onLoginClick={openLogin}
              onRegisterClick={openRegister}
            />
          }
        />

        {/* User dashboard */}
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Footer always visible */}
      <Footer />

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {authMode === "login" ? (
            <LoginForm
              onSuccess={() => {
                // ✅ Always read fresh user info after login
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                setAuthOpen(false);
                if (user.role === "admin") {
                  navigate("/admindashboard");
                } else {
                  navigate("/userdashboard");
                }
              }}
              onSwitch={() => switchMode("register")}
              onClose={closeAuth}
            />
          ) : (
            <RegisterForm
              onSuccess={() => setAuthMode("login")}
              onSwitch={() => switchMode("login")}
              onClose={closeAuth}
            />
          )}
        </div>
      )}
    </div>
  );
}
