import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AppNavbar() {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  return (
    <div className="w-full h-screen flex flex-col bg-surface-a1">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">
        {user?.firstName}
      </h1>
      <hr className="border-t-2 sm:border-t-3 mx-2" />
      <Link
        to="/app"
        className={`p-2 sm:p-3 mt-2 md:mt-4 mx-2 md:m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app" ? "text-primary-a0 spooky:text-spooky-a0" : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Dashboard
      </Link>
      <Link
        to="/app/workshops"
        className={`p-2 sm:p-3 mx-2 mt-2 md:m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/workshops"
            ? "text-primary-a0 spooky:text-spooky-a0"
            : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Workshops
      </Link>
      <Link
        to="/app/events"
        className={`p-2 sm:p-3 mx-2 mt-2 md:m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/events" ? "text-primary-a0 spooky:text-spooky-a0" : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Events
      </Link>
      <Link
        to="/app/settings"
        className={`p-2 sm:p-3 mx-2 mt-2 md:m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/settings"
            ? "text-primary-a0 spooky:text-spooky-a0"
            : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Settings
      </Link>
      {user?.accountType === "organizer" && (
        <Link
          to="/app/organizer"
          className={`p-2 sm:p-3 mx-2 mt-2 sm:m-2 rounded-lg text-xl text-center font-bold ${
            path === "/app/organizer"
              ? "text-primary-a0 spooky:text-spooky-a0"
              : ""
          } bg-surface-a2 hover:bg-surface-a3`}
        >
          Organizer
        </Link>
      )}
      {user?.accountType === "judge" && (
        <Link
          to="/app/judge"
          className={`p-2 sm:p-3 mx-2 mt-2 sm:m-2 rounded-lg text-xl text-center font-bold ${
            path === "/app/judge" ? "text-primary-a0 spooky:text-spooky-a0" : ""
          } bg-surface-a2 hover:bg-surface-a3`}
        >
          Judge
        </Link>
      )}
      <Link
        to="/"
        className="mt-auto p-2 sm:p-3 m-2 rounded-lg text-xl text-center font-bold bg-surface-a2 hover:bg-surface-a3"
      >
        Home
      </Link>
    </div>
  );
}
