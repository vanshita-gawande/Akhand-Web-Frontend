import { useEffect, useRef } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegistrationForm";

export default function AuthModal({ open, mode, onClose, onSwitchMode // mode for which form to open , open :tru/false determine ehich model to open 
//onclose : function to close model , onswitch : to switch between login/register
}) {
  const dialogRef = useRef(null);// ccreate ref to dom 

  // escape key listener , runs when model close/open, it add keybord listener when model is open 
  useEffect(() => {
    // useeffect: think- “After React paints on the screen, then run this extra side-effect code.like eventlisteners,API calls , timeouts,subscriptions”
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey); //adding eventlistener to entire doc so,browser listens for keyboard press,to allow browser to cose model with escape key
    return () => document.removeEventListener("keydown", onKey); //removes evenet from memory when model close
  }, [open, onClose]);//when opens true attch listener , close - detached
  // React stops here. No DOM is rendered This is called conditional rendering.
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
        {/* contains login and register props */}
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
/// Render = React takes your component code (JSX) and turns it into UI on the screen (HTML DOM). react renders componenet when it first appears on screen , stste chnages , props chnages, First Time (Initial Render)Component shows on screen for the first time✅ 
// What happens during render?
// React will:
// Re-run your component function
// Re-evaluate JSX
// Update the DOM where needed

// User clicks "Login"/"Register"
//       |
// Modal opens (open=true)
//       |
// useEffect adds keydown listener
//       |
// User presses ESC
//       |
// onKey calls onClose()
//       |
// Modal closes (open=false)
//       |
// cleanup removes keydown listener
