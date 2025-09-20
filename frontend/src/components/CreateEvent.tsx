import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOverlay } from "../contexts/OverlayContext";
import { createEvent } from "../utils/EventAPIHandler";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { closeOverlay } = useOverlay();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [error, setError] = useState("");

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await createEvent({
        name,
        description,
        startDate,
        endDate,
        submissionDeadline,
      });
      closeOverlay();
      navigate(`/app/organizer/event/${response.id}`);
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
    <div className="flex flex-col w-100">
      <h1 className="text-2xl font-bold text-center">Create Event</h1>
      <form className="flex flex-col" onSubmit={handleCreateEvent}>
        <label htmlFor="name" className="text-2xl mt-2">
          Event Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="description" className="text-2xl mt-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="startDate" className="text-2xl mt-2">
          Start Date
        </label>
        <input
          type="datetime-local"
          id="startDate"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="endDate" className="text-2xl mt-2">
          End Date
        </label>
        <input
          type="datetime-local"
          id="endDate"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="submissionDeadline" className="text-2xl mt-2">
          Submission Deadline
        </label>
        <input
          type="datetime-local"
          id="submissionDeadline"
          name="submissionDeadline"
          value={submissionDeadline}
          onChange={(e) => setSubmissionDeadline(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
        <div className="w-full flex flex-row mt-4">
          <button
            type="submit"
            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full"
          >
            Create
          </button>
          <button
            type="button"
            onClick={closeOverlay}
            className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg ml-2 w-full"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
