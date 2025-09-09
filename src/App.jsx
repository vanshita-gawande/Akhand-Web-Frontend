// import { useState } from "react";
// import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import LoginForm from "./components/LoginForm";
// import RegisterForm from "./components/RegisterForm";

// // Pages
// import Dashboard from "./pages/Dashboard/Dashboard";
// import UserDashboard from "./pages/UserDashboard/UserDashboard";
// import AdminDashboard from "./pages/Admindashboard";

// // -----------------------
// // Public layout component
// // -----------------------
// function PublicLayout({ onLoginClick, onRegisterClick }) {
//   return (
//     <>
//       <Navbar onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
//       <section id="home">
//         <Dashboard />
//       </section>
//       <section id="about">
//         <AboutUs />
//       </section>
//       <section id="services">
//         <Services />
//       </section>
//       <section id="footer"></section>
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
//         {/* ✅ Public pages */}
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

import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import AdminDashboard from "./pages/Admindashboard";

// -----------------------
// Public layout component
// -----------------------
function PublicLayout({ onLoginClick, onRegisterClick }) {
  return (
    <>
      <Navbar onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />
      <section id="home">
        <Dashboard /> {/* All children inside Dashboard */}
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

  // ✅ Check if user is logged in
  const isAuthenticated = !!localStorage.getItem("token");

  // ✅ Get role (from saved user object in localStorage)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "user";

  return (
    <div className="scroll-smooth">
      <Routes>
        {/* ✅ Public pages */}
        <Route
          path="/"
          element={
            <PublicLayout
              onLoginClick={openLogin}
              onRegisterClick={openRegister}
            />
          }
        />

        {/* ✅ User dashboard */}
        <Route
          path="/userdashboard"
          element={
            isAuthenticated && role === "user" ? (
              <UserDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ✅ Admin dashboard */}
        <Route
          path="/admindashboard"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>

      {/* ✅ Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {authMode === "login" ? (
            <LoginForm
              onSuccess={() => {
                setAuthOpen(false);

                // ✅ Redirect based on role
                if (role === "admin") {
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
              onSuccess={() => {
                setAuthMode("login"); // after register → login
              }}
              onSwitch={() => switchMode("login")}
              onClose={closeAuth}
            />
          )}
        </div>
      )}
    </div>
  );
}
