import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import { useOverlay } from "../../contexts/OverlayContext";
import { organizerGetAllWorkshops } from "../../utils/WorkshopAPIHandler";
import { formatDate } from "date-fns";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import CreateWorkshop from "../../components/CreateWorkshop";
import EditWorkshop from "../../components/EditWorkshop";
import DeleteWorkshop from "../../components/DeleteWorkshop";

export default function OrganizerWorkshops() {
  const { openOverlay } = useOverlay();
  const [reload, setReload] = useState(false);
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
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [displayedWorkshops, setDisplayedWorkshops] = useState<Workshop[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const fetchedWorkshops = await organizerGetAllWorkshops();
        setWorkshops(fetchedWorkshops.workshops as Workshop[]);
        setDisplayedWorkshops(fetchedWorkshops.workshops as Workshop[]);
      } catch (error: unknown) {
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
  }, [reload]);

  useEffect(() => {
    if (search.trim() === "") return setDisplayedWorkshops(workshops);
    const fuse = new Fuse(workshops, {
      keys: ["name", "description", "organizer"],
      threshold: 0.3,
    });
    const results = fuse.search(search);
    setDisplayedWorkshops(results.map((result) => result.item));
  }, [search, workshops]);

  const handleOpenCreateWorkshop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openOverlay(<CreateWorkshop />);
  };

  const handleOpenEditWorkshop = (
    e: React.MouseEvent<HTMLButtonElement>,
    workshopId: string
  ) => {
    e.preventDefault();
    openOverlay(<EditWorkshop workshopId={workshopId} setReload={setReload} />);
  };

  const handleOpenDeleteWorkshop = (
    e: React.MouseEvent<HTMLButtonElement>,
    workshopId: string,
    workshopName: string
  ) => {
    e.preventDefault();
    openOverlay(
      <DeleteWorkshop
        workshopId={workshopId}
        workshopName={workshopName}
        currentPage="workshops"
        setReload={setReload}
      />
    );
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
              <h1 className="text-4xl font-bold">Workshops</h1>
            </div>
            <div className="flex items-center">
              <button
                className="ml-auto p-2 rounded-lg text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                onClick={handleOpenCreateWorkshop}
              >
                Create Workshop
              </button>
            </div>
          </div>
          <p className="text-2xl mt-8">Loading workshops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <OrganizerNavbar />
        </div>
        <div className="w-5/6 h-full flex flex-col items-center">
          <div className="grid grid-cols-3 w-full h-[calc(10%)] p-2">
            <div />
            <div className="flex items-center justify-center text-center">
              <h1 className="text-4xl font-bold">Workshops</h1>
            </div>
            <div className="flex items-center">
              <button
                className="ml-auto p-2 rounded-lg text-lg font-bold text-center bg-primary-a0 hover:bg-primary-a1"
                onClick={handleOpenCreateWorkshop}
              >
                Create Workshop
              </button>
            </div>
          </div>
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col bg-surface-a1 mx-16 my-6 p-4 rounded-lg">
              <h2 className="text-4xl text-center">
                An error occured while fetching the workshops:
              </h2>
              <p className="text-2xl text-red-500 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <OrganizerNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col items-center overflow-y-auto">
        <div className="grid grid-cols-3 w-full h-[calc(10%)] p-2">
          <div />
          <div className="flex items-center justify-center text-center">
            <h1 className="text-4xl font-bold">Workshops</h1>
          </div>
          <div className="flex items-center">
            <button
              className="ml-auto p-2 rounded-lg text-xl font-bold text-center bg-primary-a0 hover:bg-primary-a1"
              onClick={handleOpenCreateWorkshop}
            >
              Create Workshop
            </button>
          </div>
        </div>
        <div className="flex flex-row w-full mt-2 mb-4 justify-center">
          <input
            type="text"
            placeholder="Search workshops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-lg bg-surface-a1 w-1/2"
          />
        </div>
        {displayedWorkshops.length === 0 ? (
          search ? (
            <p className="text-2xl mt-8">No workshops match your search</p>
          ) : (
            <p className="text-2xl mt-8">No workshops yet</p>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center">
            {displayedWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                className="flex flex-row bg-surface-a1 w-5/6 mt-4 p-4 rounded-lg mb-2"
              >
                <div className="flex flex-col w-2/3">
                  <h2 className="text-3xl font-bold">{workshop.name}</h2>
                  <p className="text-lg mb-2">{workshop.description}</p>
                  <div className="flex flex-row mt-auto">
                    <Link
                      to={`/app/organizer/workshop/${workshop.id}`}
                      className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold text-center w-full"
                    >
                      Open
                    </Link>
                    <button
                      className="bg-primary-a0 hover:bg-primary-a1 p-2 ml-2 rounded-lg font-bold text-center w-full"
                      onClick={(e) => handleOpenEditWorkshop(e, workshop.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 p-2 ml-2 rounded-lg font-bold w-full"
                      onClick={(e) =>
                        handleOpenDeleteWorkshop(e, workshop.id, workshop.name)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-1/3 ml-2">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
