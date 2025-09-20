import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logoutUser } from "../utils/AuthAPIHandler";

export default function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
    logout();
    navigate("/");
  };

  return (
    <div className="w-full h-screen flex flex-col bg-surface-a1">
      <h1 className="text-3xl font-bold text-center">{user?.firstName}</h1>
      <hr className="border-t-3 mx-2" />
      <Link
        to="/app"
        className={`p-3 mt-4 m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app" ? "text-primary-a1" : "text-white"
        } bg-surface-a2 hover:bg-surface-a3 hover:text-primary-a1`}
      >
        Dashboard
      </Link>
      <Link
        to="/app/settings"
        className={`p-3 m-2 rounded-lg text-xl text-center font-bold ${
          path === "/app/settings" ? "text-primary-a1" : "text-white"
        } bg-surface-a2 hover:bg-surface-a3 hover:text-primary-a1`}
      >
        Settings
      </Link>
      {user?.accountType === "organizer" && (
        <Link
          to="/app/organizer"
          className={`p-3 m-2 rounded-lg text-xl text-center font-bold ${
            path === "/app/organizer" ? "text-primary-a1" : "text-white"
          } bg-surface-a2 hover:bg-surface-a3 hover:text-primary-a1`}
        >
          Organizer
        </Link>
      )}
      <button
        className="mt-auto p-3 m-2 rounded-lg text-xl text-center font-bold text-white bg-surface-a2 hover:bg-surface-a3 hover:text-primary-a1"
        onClick={() => handleLogout()}
      >
        Logout
      </button>
    </div>
  );
}
