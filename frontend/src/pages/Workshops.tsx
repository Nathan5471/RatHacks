import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllWorkshops,
  joinWorkshop,
  leaveWorkshop,
} from "../utils/WorkshopAPIHandler";
import { formatDate } from "date-fns";
import { IoMenu } from "react-icons/io5";
import AppNavbar from "../components/AppNavbar";

export default function Workshops() {
  const { user, getUser } = useAuth();
  interface Workshop {
    id: string;
    name: string;
    description: string;
    googleMeetURL: string;
    startDate: string;
    endDate: string;
    status: "upcoming" | "ongoing" | "completed";
    participantCount: number;
    organizer: string;
  }
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [displayedWorkshops, setDisplayedWorkshops] = useState<Workshop[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchWorkshops = async () => {
      setError("");
      try {
        const response = await getAllWorkshops();
        setWorkshops(response.workshops);
        setDisplayedWorkshops(response.workshops);
      } catch (error) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  useEffect(() => {
    if (search.trim() === "") return setDisplayedWorkshops(workshops);
    const fuse = new Fuse(workshops, {
      keys: ["name", "description", "organizer"],
      threshold: 0.3,
    });
    const results = fuse.search(search);
    setDisplayedWorkshops(results.map((result) => result.item));
  }, [search, workshops]);

  const handleJoin = async (
    e: React.MouseEvent<HTMLButtonElement>,
    workshopId: string
  ) => {
    e.preventDefault();
    try {
      await joinWorkshop(workshopId);
      await getUser();
    } catch (error) {
      console.error("Error joining workshop:", error);
    }
  };

  const handleLeave = async (
    e: React.MouseEvent<HTMLButtonElement>,
    workshopId: string
  ) => {
    e.preventDefault();
    try {
      await leaveWorkshop(workshopId);
      await getUser();
    } catch (error) {
      console.error("Error leaving workshop:", error);
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
            <AppNavbar />
          </div>
        </div>
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full p-4 items-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <h1 className="text-3xl sm:text-4xl text-center font-bold">
            Workshops
          </h1>
          <p className="mt-4 text-lg">Loading workshops...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
            <AppNavbar />
          </div>
        </div>
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full p-4 items-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <h1 className="text-3xl sm:text-4xl text-center font-bold">
            Workshops
          </h1>
          <p className="mt-4 text-lg text-red-500 w-3/4 text-center">
            There was an error loading workshops, please try refreshing: {error}
          </p>
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
          <AppNavbar />
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
        <h1 className="text-3xl sm:text-4xl text-center font-bold">
          Workshops
        </h1>
        {workshops.length > 0 && (
          <div className="flex flex-row w-full mt-2 mb-2 sm:mb-4 justify-center">
            <input
              type="text"
              placeholder="Search workshops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 rounded-lg bg-surface-a1 w-5/6 sm:w-1/2"
            />
          </div>
        )}
        {displayedWorkshops.length === 0 ? (
          search ? (
            <p className="mt-4 text-lg">No workshops match your search</p>
          ) : (
            <p className="mt-4 text-lg">No workshops available.</p>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center">
            {displayedWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="flex flex-col sm:flex-row bg-surface-a1 w-full sm:w-5/6 mt-2 mb-4 p-4 rounded-lg"
              >
                <div className="flex flex-col w-full sm:w-2/3">
                  <h2 className="text-3xl text-center font-bold">
                    {workshop.name}
                  </h2>
                  <p className="text-lg mb-2">{workshop.description}</p>
                  <div className="flex flex-row w-full mt-auto">
                    <Link
                      to={`/app/workshop/${workshop.id}`}
                      className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 p-2 rounded-lg font-bold text-center w-full"
                    >
                      Open
                    </Link>
                    {workshop.status === "upcoming" &&
                      (user && user.workshops.includes(workshop.id) ? (
                        <button
                          onClick={(e) => handleLeave(e, workshop.id)}
                          className="bg-red-500 hover:bg-red-600 p-2 ml-2 rounded-lg font-bold w-full"
                        >
                          Leave
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleJoin(e, workshop.id)}
                          className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a1 spooky:hover:bg-spooky-a1 p-2 ml-2 rounded-lg font-bold w-full"
                        >
                          Join
                        </button>
                      ))}
                    {workshop.status === "ongoing" && (
                      <a
                        href={workshop.googleMeetURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 p-2 ml-2 rounded-lg font-bold text-center w-full"
                      >
                        Join Meeting
                      </a>
                    )}
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
                    {workshop.participantCount}
                  </p>
                  <p>
                    <span className="font-bold">Organizer:</span>{" "}
                    {workshop.organizer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
