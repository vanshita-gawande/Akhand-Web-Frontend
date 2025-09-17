// src/pages/Dashboard/Dashboard.jsx
import WelcomeSection from "./WelcomeSection";
import AboutUs from "./AboutUs";
import Services from "./Services";
import VenuesSection from "./VenuesSection";
import RegisterPromptModal from "./popups/RegisterPromptPopup";
import { useState } from "react";

export default function Dashboard({ onLoginClick, onRegisterClick }) {
  const companyName = "Akhand Sports";
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-12 mt-6">
      <WelcomeSection />
      <VenuesSection
        limitCards={true}
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
      />
      <AboutUs companyName={companyName} />
      <Services />

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