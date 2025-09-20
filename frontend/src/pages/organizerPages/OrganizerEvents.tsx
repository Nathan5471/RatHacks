import { useState, useEffect } from "react";
import { useOverlay } from "../../contexts/OverlayContext";
import { organizerGetAllEvents } from "../../utils/EventAPIHandler";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import CreateEvent from "../../components/CreateEvent";

export default function OrganizerEvents() {
  const { openOverlay } = useOverlay();
  interface Participant {
    id: string;
    email: string;
    emailVerified: boolean;
    accountType: "student" | "organizer" | "judge";
    firstName: string;
    lastName: string;
    schoolDivision: string;
    gradeLevel: "nine" | "ten" | "eleven" | "twelve" | "organizer" | "judge";
    isGovSchool: boolean;
    createdAt: Date;
  }
  interface Event {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    submissionDeadline: Date;
    participants: Participant[];
    createdBy: string;
    createdAt: Date;
  }
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await organizerGetAllEvents();
        interface FetchedEvent {
          id: string;
          name: string;
          description: string;
          startDate: string;
          endDate: string;
          submissionDeadline: string;
          participants: Participant[];
          createdBy: string;
          createdAt: string;
        }
        const datedEvents = fetchedEvents.map((event: FetchedEvent) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          submissionDeadline: new Date(event.submissionDeadline),
          participants: event.participants,
          createdBy: event.createdBy,
          createdAt: new Date(event.createdAt),
        }));
        setEvents(datedEvents);
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unkown error accured";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleOpenCreateEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openOverlay(<CreateEvent />);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <OrganizerNavbar />
        </div>
        <div className="w-5/6 h-full flex flex-col items-center">
          <div className="grid grid-cols-3 w-full h-[calc(10%)] p-2">
            <div />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-4xl font-bold">Events</h1>
            </div>
            <div className="flex items-center">
              <button
                className="ml-auto p-2 rounded-lg text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                onClick={handleOpenCreateEvent}
              >
                Add Event
              </button>
            </div>
          </div>
          <p className="text-2xl mt-8">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <OrganizerNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col items-center">
        <div className="grid grid-cols-3 w-full h-[calc(10%)] p-2">
          <div />
          <div className="flex items-center justify-center text-center">
            <h1 className="text-4xl font-bold">Events</h1>
          </div>
          <div className="flex items-center">
            <button
              className="ml-auto p-2 rounded-lg text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1"
              onClick={handleOpenCreateEvent}
            >
              Add Event
            </button>
          </div>
        </div>
        {events.length === 0 ? (
          <p className="text-2xl mt-8">No events yet</p>
        ) : (
          <div className="w-full h-full flex flex-col">
            {events.map((event) => (
              <div className="bg-surface-a1"></div> // TODO: Finish adding events
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
