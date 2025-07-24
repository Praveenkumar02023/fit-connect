import { Outlet } from "react-router-dom";
import TrainerNavbar from "./TrainerNavbar";
import Footer from "../LandingPage/Footer";

const TrainerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <TrainerNavbar />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default TrainerLayout;
