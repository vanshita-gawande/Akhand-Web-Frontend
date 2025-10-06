import { useState } from "react";
import Overview from "./Overview";
import Users from "./CurrentUsers";
import Admins from "./Admins";
import Logs from "./Logs";
import Settings from "./Settings";

export default function SuperadminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "users":
        return <Users />;
      case "admins":
        return <Admins />;
      case "logs":
        return <Logs />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      

      {/* Main Content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
}
