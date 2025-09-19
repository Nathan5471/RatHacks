import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAll } from "../utils/AuthAPIHandler";
import { useOverlay } from "../contexts/OverlayContext";
import { useAuth } from "../contexts/AuthContext";

export default function LogoutAllDevices() {
  const { closeOverlay } = useOverlay();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogoutAll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logoutAll();
      logout();
      closeOverlay();
      navigate("/");
    } catch (error: unknown) {
      console.error("Logout all devices error:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-80">
      <h1 className="text-2xl font-bold text-center">Logout All Devices</h1>
      <form className="flex flex-col" onSubmit={handleLogoutAll}>
        <p className="text-center mt-4">
          Are you sure you want to logout from all devices?
        </p>
        {error && (
          <p className="text-lg mt-2 text-center text-red-500 font-bold">
            {error}
          </p>
        )}
        <div className="flex flex-row w-full mt-4">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 font-bold p-2 rounded-lg w-full"
          >
            Logout All
          </button>
          <button
            type="button"
            className="bg-surface-a1 hover:bg-surface-a2 font-bold p-2 rounded-lg w-full ml-2"
            onClick={closeOverlay}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
