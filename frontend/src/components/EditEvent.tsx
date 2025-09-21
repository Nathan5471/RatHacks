import { useState, useEffect } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { organizerGetEventById, updateEvent } from "../utils/EventAPIHandler";

export default function EditEvent({
  eventId,
  setReload,
}: {
  eventId: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay } = useOverlay();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      setError("");
      try {
        interface EventData {
          name: string;
          description: string;
          location: string;
          startDate: string;
          endDate: string;
          submissionDeadline: string;
        }
        const response = await organizerGetEventById(eventId);
        const event = response.event as EventData;
        setName(event.name);
        setDescription(event.description);
        setLocation(event.location);
        setStartDate(formatDateForInput(event.startDate));
        setEndDate(formatDateForInput(event.endDate));
        setSubmissionDeadline(formatDateForInput(event.submissionDeadline));
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unknown error occured";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await updateEvent(eventId, {
        name,
        description,
        location,
        startDate,
        endDate,
        submissionDeadline,
      });
      setReload((prev) => !prev);
      closeOverlay();
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

  if (loading) {
    return (
      <div className="flex flex-col w-100">
        <h1 className="text-2xl font-bold text-center">Edit Event</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-100">
      <h1 className="text-2xl font-bold text-center">Edit Event</h1>
      <form className="flex flex-col" onSubmit={handleUpdateEvent}>
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
        <label htmlFor="location" className="text-2xl mt-2">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
          className="p-2 roudned-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        {error && <p className="text-red-500 text-lg mt-2">{error}</p>}
        <div className="w-full flex flex-row mt-4">
          <button
            type="submit"
            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg w-full font-bold"
          >
            Update
          </button>
          <button
            type="button"
            onClick={closeOverlay}
            className="bg-surface-a2 hover:bg-surface-a2 p-2 rounded-lg ml-2 w-full font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
