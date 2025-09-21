import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AppNavbar() {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  return (
    <div className="w-full h-screen flex flex-col bg-surface-a1">
      <h1 className="text-3xl font-bold text-center">{user?.firstName}</h1>
      <hr className="border-t-3 mx-2" />
      <Link
        to="/app"
        className={`p-3 mt-4 m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app" ? "text-primary-a1" : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Dashboard
      </Link>
      <Link
        to="/app/events"
        className={`p-3 m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/events" ? "text-primary-a1" : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Events
      </Link>
      <Link
        to="/app/settings"
        className={`p-3 m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/settings" ? "text-primary-a1" : ""
        } bg-surface-a2 hover:bg-surface-a3`}
      >
        Settings
      </Link>
      {user?.accountType === "organizer" && (
        <Link
          to="/app/organizer"
          className={`p-3 m-2 rounded-lg text-xl text-center font-bold ${
            path === "/app/organizer" ? "text-primary-a1" : ""
          } bg-surface-a2 hover:bg-surface-a3`}
        >
          Organizer
        </Link>
      )}
      <Link
        to="/"
        className="mt-auto p-3 m-2 rounded-lg text-xl text-center font-bold bg-surface-a2 hover:bg-surface-a3"
      >
        Home
      </Link>
    </div>
  );
}
