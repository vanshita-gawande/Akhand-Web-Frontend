// maintain all routes regarding registartion form and its switches
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <RegisterForm
      onSuccess={() => navigate("/login")} // ✅ after popup → go to login
      onSwitch={() => navigate("/login")} // ✅ when "Already have account?"
      onClose={() => navigate("/")} // optional close button
    />
  );
}
