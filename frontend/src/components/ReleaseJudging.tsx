import { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { releaseJudging } from "../utils/EventAPIHandler";

export default function DeleteEvent({
  eventId,
  eventName,
  setReload,
}: {
  eventId: string;
  eventName: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}) {
  const { closeOverlay } = useOverlay();
  const [error, setError] = useState("");

  const handleDeleteEvent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    try {
      await releaseJudging(eventId);
      closeOverlay();
      if (setReload !== undefined) {
        setReload((prev) => !prev);
      }
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
      <h1 className="text-2xl font-bold text-center">
        Release Judging for {eventName}
      </h1>
      <p className="text-lg text-center">
        Are you sure you would like to release judging for the event{" "}
        <span className="font-bold">{eventName}</span>?
      </p>
      {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
      <div className="w-full flex flex-row mt-4">
        <button
          className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold"
          onClick={handleDeleteEvent}
        >
          Release
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
