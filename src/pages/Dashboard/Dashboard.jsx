// src/pages/Dashboard/Dashboard.jsx
import WelcomeSection from "./WelcomeSection";
import AboutUs from "./AboutUs";
import Services from "./Services";
import Footer from "./Footer";
import VenuesSection from "./VenuesSection";
import RegisterPromptModal from "./popups/RegisterPromptPopup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard({ onLoginClick, onRegisterClick }) {
  const companyName = "Akhand Sports";
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  const handleRegisterClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowModal(true); // open popup
      return;
    }

    console.log("Proceed with booking… user is logged in ✅");
    // ✅ user is logged in, redirect to UserDashboard
    navigate("/userdashboard");
  };

  return (
    <main className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-12 mt-6">
      <WelcomeSection />
      <VenuesSection onRegisterClick={handleRegisterClick} />
      <AboutUs companyName={companyName} />
      <Services />
      <Footer />

      {/* Modal */}
      <RegisterPromptModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogin={() => {
          setShowModal(false);
          onLoginClick(); // ✅ triggers LoginForm popup
        }}
        onRegister={() => {
          setShowModal(false);
          onRegisterClick(); // ✅ triggers RegisterForm popup
        }}
      />
    </main>
  );
}