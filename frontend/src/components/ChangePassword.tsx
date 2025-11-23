import { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { updatePassword } from "../utils/AuthAPIHandler";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function ChangePassword() {
  const { closeOverlay } = useOverlay();
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await updatePassword(newPassword);
      closeOverlay();
    } catch (error: unknown) {
      console.error("Change password error:", error);
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
      <h1 className="text-2xl font-bold text-center">Change Password</h1>
      <form className="flex flex-col" onSubmit={handleUpdatePassword}>
        <label htmlFor="newPassword" className="text-2xl mt-2">
          New Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="ml-2 bg-surface-a2 rounded-lg hover:bg-surface-a3 p-2"
          >
            {showNewPassword ? (
              <IoEyeOff className="text-lg" />
            ) : (
              <IoEye className="text-lg" />
            )}
          </button>
        </div>
        <label htmlFor="confirmNewPassword" className="text-2xl mt-2">
          Confirm New Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            className="ml-2 bg-surface-a2 rounded-lg hover:bg-surface-a3 p-2"
          >
            {showConfirmNewPassword ? (
              <IoEyeOff className="text-lg" />
            ) : (
              <IoEye className="text-lg" />
            )}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <div className="flex flex-row w-full">
          <button
            type="submit"
            className="mt-4 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold"
          >
            Change Password
          </button>
          <button
            type="button"
            onClick={closeOverlay}
            className="mt-4 ml-2 bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-full font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
