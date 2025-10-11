import { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { cancelInvite } from "../utils/AuthAPIHandler";

export default function CancelInvite({
  email,
  setReload,
}: {
  email: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay } = useOverlay();
  const [error, setError] = useState("");

  const handleCancelInvite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    try {
      await cancelInvite(email);
      closeOverlay();
      setReload((prev) => !prev);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-80">
      <h1 className="text-2xl font-bold text-center">Cancel Invite</h1>
      <p className="text-lg text-center">
        Are you sure you would like to cancel the invite sent to{" "}
        <span className="font-bold">{email}</span>? This action is permanent and
        can't be undone.
      </p>
      {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
      <div className="w-full flex flex-row mt-4">
        <button
          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg w-full font-bold"
          onClick={handleCancelInvite}
        >
          Cancel Invite
        </button>
        <button
          className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-full font-bold ml-2"
          onClick={closeOverlay}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
