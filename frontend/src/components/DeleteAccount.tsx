import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOverlay } from "../contexts/OverlayContext";
import { deleteUser } from "../utils/AuthAPIHandler";

export default function DeleteAccount() {
  const { closeOverlay } = useOverlay();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleDeleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deleteUser();
      closeOverlay();
      navigate("/");
    } catch (error: unknown) {
      console.error("Delete account error:", error);
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
      <h1 className="text-2xl font-bold text-center">Delete Account</h1>
      <form className="flex flex-col" onSubmit={handleDeleteUser}>
        <p className="text-lg mt-2 text-center text-red-500 font-bold">
          Are you sure you want to delete your account? This action is permanent
          and can't be undone.
        </p>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <div className="flex flex-row w-full mt-2">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg w-full"
          >
            Delete Account
          </button>
          <button
            type="button"
            className="bg-surface-a1 hover:bg-surface-a2 p-2 rounded-lg ml-2 w-full"
            onClick={closeOverlay}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
