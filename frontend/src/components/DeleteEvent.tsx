import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOverlay } from "../contexts/OverlayContext";
import { deleteEvent } from "../utils/EventAPIHandler";

export default function DeleteEvent({
  eventId,
  eventName,
  currentPage,
  setReload,
}: {
  eventId: string;
  eventName: string;
  currentPage: "events" | "event";
  setReload: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}) {
  const navigate = useNavigate();
  const { closeOverlay } = useOverlay();
  const [error, setError] = useState("");

  const handleDeleteEvent = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    try {
      await deleteEvent(eventId);
      closeOverlay();
      if (currentPage === "event") {
        navigate("/app/organizer/events");
      }
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
      <h1 className="text-2xl font-bold text-center">Delete {eventName}</h1>
      <p className="text-lg text-red-500 text-center">
        Are you sure you would like to delete the event,{" "}
        <span className="font-bold">{eventName}</span>? This action is permanent
        and can't be undone.
      </p>
      {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
      <div className="w-full flex flex-row mt-4">
        <button
          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg w-full font-bold"
          onClick={handleDeleteEvent}
        >
          Delete
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
