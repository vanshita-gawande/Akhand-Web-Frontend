import { useEffect, useRef } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegistrationForm";

export default function AuthModal({ open, mode, onClose, onSwitchMode }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div
        ref={dialogRef}
        className="relative z-50 w-full max-w-md mx-4 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-lg font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Form */}
        {mode === "login" ? (
          <LoginForm
            onSuccess={onClose}
            footer={
              <p className="text-center text-gray-500 mt-4 text-sm">
                Not registered?{" "}
                <button
                  className="text-purple-600 hover:underline font-medium"
                  onClick={() => onSwitchMode("register")}
                >
                  Create an account
                </button>
              </p>
            }
          />
        ) : (
          <RegisterForm
            onSuccess={() => onSwitchMode("login")}
            footer={
              <p className="text-center text-gray-500 mt-4 text-sm">
                Already have an account?{" "}
                <button
                  className="text-purple-600 hover:underline font-medium"
                  onClick={() => onSwitchMode("login")}
                >
                  Sign in
                </button>
              </p>
            }
          />
        )}
      </div>
    </div>
  );
}
