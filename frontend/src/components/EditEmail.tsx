import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useOverlay } from "../contexts/OverlayContext";
import { organizerGetEmailById, updateEmail } from "../utils/EmailAPIHandler";
import { organizerGetAllEvents } from "../utils/EventAPIHandler";
import { organizerGetAllWorkshops } from "../utils/WorkshopAPIHandler";

export default function EditEmail({
  emailId,
  setReload,
}: {
  emailId: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay } = useOverlay();
  const [messageSubject, setMessageSubject] = useState("");
  const [name, setName] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [viewSelection, setViewSelection] = useState<"edit" | "preview">(
    "edit"
  );
  const [filterBy, setFilterBy] = useState<string | null>(null);
  const [subFilterBy, setSubFilterBy] = useState<string | null>(null);
  const [sendAll, setSendAll] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [workshops, setWorkshops] = useState<string[]>([]);

  interface Participants {
    id: string;
    email: string;
    emailVerified: boolean;
    accountType: "student" | "organizer" | "judge";
    firstName: string;
    lastName: string;
    schoolDivision: string;
    gradeLevel: "nine" | "ten" | "eleven" | "twelve" | "organizer" | "judge";
    isGovSchool: boolean;
    techStack: string;
    previousHackathon: boolean;
    parentFirstName: string;
    parentLastName: string;
    parentEmail: string;
    parentPhoneNumber: string;
    contactFirstName: string;
    contactLastName: string;
    contactRelationship: string;
    contactPhoneNumber: string;
    events: string[];
    workshops: string[];
    createdAt: string;
  }
  interface Workshop {
    id: string;
    name: string;
    description: string;
    googleMeetURL: string;
    startDate: string;
    endDate: string;
    status: "upcoming" | "ongoing" | "completed";
    participants: Participants[];
    organizer: string;
    organizerId: string;
    createdAt: string;
  }
  interface Team {
    id: string;
    joinCode: string;
    members: string[];
    eventId: string;
    submittedProject: boolean;
    project: string | null;
    createdAt: string;
  }
  interface Event {
    id: string;
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
    status: "upcoming" | "ongoing" | "completed";
    participants: Participants[];
    teams: Team[];
    createdBy: string;
    createdAt: string;
  }

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const fetchedWorkshops = await organizerGetAllWorkshops();
        setWorkshops(
          fetchedWorkshops.workshops.map((workshop: Workshop) => ({
            name: workshop.name,
            id: workshop.id,
          }))
        ); // array of strings
      } catch (error: unknown) {
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
    fetchWorkshops();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await organizerGetAllEvents();
        setEvents(
          fetchedEvents.events.map((event: Event) => ({
            name: event.name,
            id: event.id,
          }))
        );
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unkown error accured";
        setError(errorMessage);
      }
    };
    fetchEvents();
  }, []);

  const filterMap = new Map();
  filterMap.set("event", "Event");
  filterMap.set("workshop", "Workshop");
  filterMap.set("gradeLevel", "Grade Level");
  filterMap.set("school", "School");

  const subFilterMap = new Map();
  subFilterMap.set("event", events);
  subFilterMap.set("workshop", workshops);
  subFilterMap.set("gradeLevel", [
    { name: "Ninth", id: "nine" },
    { name: "Tenth", id: "nine" },
    { name: "Eleventh", id: "nine" },
    { name: "Twelfth", id: "nine" },
  ]);
  subFilterMap.set("school", [
    { name: "Bedford County", id: "Bedford County" },
    { name: "Craig County", id: "Craig County" },
    { name: "Floyd County", id: "Floyd County" },
    { name: "Franklin County", id: "Franklin County" },
    { name: "Roanoke City", id: "Roanoke City" },
    { name: "Roanoke County", id: "Roanoke County" },
    { name: "Salem City", id: "Salem City" },
    { name: "Other", id: "Other" },
  ]);

  useEffect(() => {
    const fetchEmailData = async () => {
      setError("");
      try {
        interface EmailData {
          name: string;
          messageSubject: string;
          messageBody: string;
          sendAll: boolean;
          filterBy: string | null;
          subFilterBy: string | null;
          sent: boolean;
        }
        const response = await organizerGetEmailById(emailId);
        const email = response.email as EmailData;
        setName(email.name);
        setMessageSubject(email.messageSubject);
        setMessageBody(email.messageBody);
        setFilterBy(email.filterBy);
        setSubFilterBy(email.subFilterBy);
        setSendAll(email.sendAll);
        setSent(email.sent);
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
    fetchEmailData();
  }, [emailId]);

  useEffect(() => {
    if (sendAll) {
      setFilterBy(null);
      setSubFilterBy(null);
    }
  }, [sendAll]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      console.log(
        "update info",
        name,
        messageSubject,
        messageBody,
        sendAll,
        filterBy,
        subFilterBy,
        sent
      );
      await updateEmail(emailId, {
        name,
        messageSubject,
        messageBody,
        sendAll,
        filterBy,
        subFilterBy,
        sent,
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
        <h1 className="text-2xl font-bold mb-4">Edit Email</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-80 sm:w-100">
      <h1 className="text-2xl font-bold text-center">Edit Email</h1>
      <form className="flex flex-col" onSubmit={handleUpdateEmail}>
        <label htmlFor="name" className="text-2xl mt-2">
          Name
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
        <label htmlFor="messageSubject" className="text-2xl mt-2">
          Subject
        </label>
        <input
          type="text"
          id="messageSubject"
          name="messageSubject"
          value={messageSubject}
          onChange={(e) => setMessageSubject(e.target.value)}
          className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          required
        />
        <label htmlFor="messageBody" className="text-2xl mt-2">
          Body
        </label>
        <div className="flex flex-row mt-1">
          <button
            type="button"
            className={`p-2 rounded-lg font-bold w-full mr-2 ${
              viewSelection === "edit"
                ? "bg-primary-a0 hover:bg-primary-a1"
                : "bg-surface-a2 hover:bg-surface-a3"
            }`}
            onClick={() => setViewSelection("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            className={`p-2 rounded-lg font-bold w-full ${
              viewSelection === "preview"
                ? "bg-primary-a0 hover:bg-primary-a1"
                : "bg-surface-a2 hover:bg-surface-a3"
            }`}
            onClick={() => setViewSelection("preview")}
          >
            Preview
          </button>
        </div>
        {viewSelection === "edit" && (
          <textarea
            id="messageBody"
            name="messageBody"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
            required
          />
        )}
        {viewSelection === "preview" && (
          <div className="p-2 rounded-lg bg-surface-a2 w-full mt-1 overflow-auto max-h-96">
            <ReactMarkdown
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h1: ({ node, ...props }) => (
                  <h1 className="text-4xl font-bold" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h2: ({ node, ...props }) => (
                  <h2 className="text-3xl font-bold" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h3: ({ node, ...props }) => (
                  <h3 className="text-2xl font-semibold" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h4: ({ node, ...props }) => (
                  <h4 className="text-xl font-semibold" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h5: ({ node, ...props }) => (
                  <h5 className="text-lg font-semibold" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                a: ({ node, ...props }) => (
                  <a className="text-primary-a0 hover:underline" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside my-2" {...props} />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside my-2" {...props} />
                ),
              }}
            >
              {messageBody}
            </ReactMarkdown>
          </div>
        )}
        <div className="flex mt-2 w-full gap-2">
          <label htmlFor="sendAll" className="text-2xl text-nowrap">
            Send All?
          </label>
          <input
            type="checkbox"
            id="sendAll"
            name="sendAll"
            className="p-2 rounded-lg text-lg bg-surface-a2"
            onChange={(e) => setSendAll(e.target.checked)}
            checked={sendAll}
          />
        </div>
        {!sendAll && (
          <>
            <label htmlFor="filterBy" className="text-2xl mt-2">
              Filter Receipients By
            </label>
            <select
              name="filterBy"
              id="filterBy"
              className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="">Select a Filter</option>
              <option value="event">Event</option>
              <option value="workshop">Workshop</option>
              <option value="gradeLevel">Grade Level</option>
              <option value="school">School</option>
            </select>
          </>
        )}
        {!sendAll && filterBy && (
          <>
            <label htmlFor="subFilterBy" className="text-2xl mt-2">
              {filterMap.get(filterBy)}?
            </label>
            <select
              name="subFilterBy"
              id="subFilterBy"
              className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
              onChange={(e) => setSubFilterBy(e.target.value)}
            >
              <option value="">Select a {filterMap.get(filterBy)}</option>
              {subFilterMap
                .get(filterBy)
                .map((catergory: { name: string; id: string }) => (
                  <option value={catergory.id} key={catergory.id}>
                    {catergory.name}
                  </option>
                ))}
            </select>
          </>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
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
            className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg ml-2 w-full font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
