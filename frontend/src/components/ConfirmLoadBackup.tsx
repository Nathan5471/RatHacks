import { useState } from "react";
import type React from "react";
import { toast } from "react-toastify";
import { loadBackup } from "../utils/BackupAPIHandler";
import { useOverlay } from "../contexts/OverlayContext";

export default function ConfirmLoadBackup({
  backupName,
}: {
  backupName: string;
}) {
  const { closeOverlay } = useOverlay();
  const [error, setError] = useState<string | null>(null);

  const handleLoadBackup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await loadBackup(backupName);
      toast.success("Successfully loaded backup");
      closeOverlay();
    } catch (error: unknown) {
      console.error("Error loading backup:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
      toast.error(`Failed to loadBackup: ${errorMessage}`);
    }
  };

  return (
    <div className="flex flex-col w-80">
      <h1 className="text-2xl font-bold text-center">Load Backup</h1>
      <p className="text-center mt-4">
        Are you sure you want to load this backup, "{backupName}"?
      </p>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      <div className="flex flex-row w-full mt-4">
        <button
          onClick={handleLoadBackup}
          className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold mr-2"
        >
          Load Backup
        </button>
        <button
          onClick={closeOverlay}
          className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-full font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
