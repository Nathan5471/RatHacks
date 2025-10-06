import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import {
  organizerGetWorkshopById,
  addGoogleMeetURL,
  endWorkshop,
} from "../../utils/WorkshopAPIHandler";
import { formatDate } from "date-fns";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import EditWorkshop from "../../components/EditWorkshop";
import DeleteWorkshop from "../../components/DeleteWorkshop";
import OrganizerUserView from "../../components/OrganizerUserView";

export default function OrganizerWorkshop() {
  const { openOverlay } = useOverlay();
  const { workshopId } = useParams<{ workshopId: string }>();
  const [reload, setReload] = useState(false);
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
    participants: Participant[];
    organizer: string;
    organizerId: string;
    createdAt: string;
  }
  const gradeMap = {
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    organizer: "Organizer",
    judge: "Judge",
  };
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [googleMeetURL, setGoogleMeetURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (workshopId) {
          const response = await organizerGetWorkshopById(workshopId);
          setWorkshop(response.workshop as Workshop);
        }
      } catch (error: unknown) {
        console.error("Error fetching workshop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [workshopId, reload]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!workshop) return null;
      if (workshop.googleMeetURL) return null;
      const now = new Date();
      const startDate = new Date(workshop.startDate);
      const difference = startDate.getTime() - now.getTime();

      if (difference <= 0) return null;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    const updateTimeRemaining = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(updateTimeRemaining);
  }, [workshop]);

  const handleOpenEditEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (workshopId) {
      openOverlay(
        <EditWorkshop workshopId={workshopId} setReload={setReload} />
      );
    }
  };

  const handleOpenDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (workshopId && workshop) {
      openOverlay(
        <DeleteWorkshop
          workshopId={workshopId}
          workshopName={workshop.name}
          currentPage="workshop"
          setReload={undefined}
        />
      );
    }
  };

  const handleAddGoogleMeetURL = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!workshopId) return;
    try {
      await addGoogleMeetURL(workshopId, googleMeetURL);
      setGoogleMeetURL("");
      setReload(!reload);
    } catch (error) {
      console.error("Error adding Google Meet URL:", error);
    }
  };

  const handleEndWorkshop = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!workshopId) return;
    try {
      await endWorkshop(workshopId);
      setReload(!reload);
    } catch (error) {
      console.error("Error ending workshop:", error);
    }
  };

  const handleOpenUserView = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    if (workshopId && workshop) {
      openOverlay(<OrganizerUserView user={workshop?.participants[index]} />);
    }
  };

  if (loading) {
    return (
      <div className="relative w-screen h-screen flex flex-col sm:flex-row bg-surface-a0 text-white">
        <div
          className={`${
            navbarOpen ? "absolute inset-0 z-50 block bg-black/50" : "hidden"
          } md:block w-full md:w-1/5 lg:w-1/6 h-full`}
          onClick={() => setNavbarOpen(false)}
        >
          <div
            className="w-1/2 sm:w-1/3 md:w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <OrganizerNavbar />
          </div>
        </div>
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <h1 className="text-4xl">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen flex flex-col sm:flex-row bg-surface-a0 text-white">
      <div
        className={`${
          navbarOpen ? "absolute inset-0 z-50 block bg-black/50" : "hidden"
        } md:block w-full md:w-1/5 lg:w-1/6 h-full`}
        onClick={() => setNavbarOpen(false)}
      >
        <div
          className="w-1/2 sm:w-1/3 md:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <OrganizerNavbar />
        </div>
      </div>
      <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center">
        <button
          className={`absolute top-4 left-4 md:hidden ${
            navbarOpen ? "hidden" : ""
          }`}
          onClick={() => setNavbarOpen(true)}
        >
          <IoMenu className="text-3xl hover:text-4xl" />
        </button>
        {workshop ? (
          <div className="w-5/6 mt-5 flex flex-col mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
              {workshop.name}
            </h1>
            <div className="flex flex-col sm:flex-row bg-surface-a1 mt-2 mb-4 p-4 rounded-lg">
              <div className="flex flex-col w-full sm:w-2/3">
                <p className="text-lg mb-2">{workshop.description}</p>
                <div className="flex flex-row w-full mt-auto">
                  <Link
                    to="/app/organizer/workshops"
                    className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full"
                  >
                    Back to Workshops
                  </Link>
                  <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                    onClick={handleOpenEditEvent}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
                    onClick={handleOpenDeleteEvent}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-full sm:w-1/3 sm:ml-2">
                <p>
                  <span className="font-bold">Status:</span> {workshop.status}
                </p>
                <span className="font-bold">Start Date:</span>{" "}
                {formatDate(workshop.startDate, "EEEE, MMMM d yyyy h:mm a")}
                <span className="font-bold">End Date:</span>{" "}
                {formatDate(workshop.endDate, "EEEE, MMMM d yyyy h:mm a")}
                <p>
                  <span className="font-bold">Participants:</span>{" "}
                  {workshop.participants.length}
                </p>
                <p>
                  <span className="font-bold">Organizer:</span>{" "}
                  {workshop.organizer}
                </p>
              </div>
            </div>
            {workshop.status === "ongoing" && (
              <div className="flex flex-col sm:flex-row w-full mt-4 bg-surface-a1 p-4 rounded-lg">
                <div className="flex flex-col w-full sm:w-4/5">
                  <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
                    Workshop is live! Join now:
                  </h2>
                  <a
                    href={workshop.googleMeetURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-a0 text-center sm:text-lg hover:underline break-all"
                  >
                    {workshop.googleMeetURL}
                  </a>
                </div>
                <div className="flex flex-col w-full mt-2 sm:mt-0 sm:w-1/5 justify-center">
                  <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                    onClick={handleEndWorkshop}
                  >
                    End Meeting
                  </button>
                </div>
              </div>
            )}
            {workshop.status === "upcoming" && (
              <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-2">
                  {workshop.name} Countdown
                </h2>
                <div className="flex flex-row justify-center">
                  <div className="flex flex-col bg-surface-a2 rounded-lg w-25 sm:w-30 p-1 sm:p-4 mx-1 sm:mx-2">
                    <span className="text-3xl sm:text-5xl font-bold text-primary-a0 text-center">
                      {timeRemaining?.days || 0}
                    </span>
                    <span className="text-lg sm:text-xl text-center">Days</span>
                  </div>
                  <div className="flex flex-col bg-surface-a2 rounded-lg w-25 sm:w-30 p-1 sm:p-4 mx-1 sm:mx-2">
                    <span className="text-3xl sm:text-5xl font-bold text-primary-a0 text-center">
                      {timeRemaining?.hours || 0}
                    </span>
                    <span className="text-lg sm:text-xl text-center">
                      Hours
                    </span>
                  </div>
                  <div className="flex flex-col bg-surface-a2 rounded-lg w-25 sm:w-30 p-1 sm:p-4 mx-1 sm:mx-2">
                    <span className="text-3xl sm:text-5xl font-bold text-primary-a0 text-center">
                      {timeRemaining?.minutes || 0}
                    </span>
                    <span className="text-lg sm:text-xl text-center">
                      Minutes
                    </span>
                  </div>
                  <div className="flex flex-col bg-surface-a2 rounded-lg w-25 sm:w-30 p-1 sm:p-4 mx-1 sm:mx-2">
                    <span className="text-3xl sm:text-5xl font-bold text-primary-a0 text-center">
                      {timeRemaining?.seconds || 0}
                    </span>
                    <span className="text-lg sm:text-xl text-center">
                      Seconds
                    </span>
                  </div>
                </div>
                <form onSubmit={handleAddGoogleMeetURL} className="mt-4">
                  <label htmlFor="googleMeetURL" className="font-bold">
                    Google Meet URL:
                  </label>
                  <div className="flex flex-row mt-2">
                    <input
                      type="url"
                      id="googleMeetURL"
                      name="googleMeetURL"
                      value={googleMeetURL}
                      onChange={(e) => setGoogleMeetURL(e.target.value)}
                      placeholder="Enter Google Meet URL"
                      className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-primary-a0 hover:bg-primary-a1 px-8 py-2 ml-2 rounded-lg font-bold"
                    >
                      Start
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
                Registered Participants ({workshop.participants.length})
              </h2>
              {workshop.participants.length > 0 ? (
                <table className="min-w-full bg-surface-a2 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Name
                      </th>
                      <th className="hidden sm:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Email
                      </th>
                      <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        School Division
                      </th>
                      <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Grade Level
                      </th>
                      <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Is RVGS
                      </th>
                      <th className="py-2 px-4 border-b border-surface-a1 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {workshop.participants.map((participant, index) => (
                      <tr key={participant.id}>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.firstName} {participant.lastName}
                        </td>
                        <td
                          className={`hidden sm:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.email}
                        </td>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.schoolDivision}
                        </td>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {gradeMap[participant.gradeLevel]}
                        </td>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {participant.isGovSchool ? "Yes" : "No"}
                        </td>
                        <td
                          className={`py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          <button
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                            onClick={(e) => handleOpenUserView(e, index)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No participants registered yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">Workshop not found</h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/organizer/workshops"
                className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
              >
                Back to Workshops
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
