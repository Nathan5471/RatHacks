import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOverlay } from "../../contexts/OverlayContext";
import { organizerGetProjectById } from "../../utils/ProjectAPIHandler";
// import { formatDate } from "date-fns";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import EditEvent from "../../components/EditEvent";
import DeleteEvent from "../../components/DeleteEvent";
// import OrganizerUserView from "../../components/OrganizerUserView";
import LinkDetectedText from "../../components/LinkDetectedText";

export default function OrganizerProject() {
  const { openOverlay } = useOverlay();
  const { projectId } = useParams<{ projectId: string }>();
  const [reload, setReload] = useState(false);
  interface Participant {
    id: string;
    email: string;
    emailVerified: boolean;
    accountType: "student" | "organizer" | "judge";
    firstName: string;
    lastName: string;
    schoolDivision: string;
    gradeLevel: "nine" | "ten" | "eleven" | "twelve";
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
    checkedIn: boolean;
    createdAt: string;
  }
  interface Team {
    id: string;
    joinCode: string;
    members: Participant[];
    eventId: string;
    submittedProject: boolean;
    project: string | null;
    createdAt: string;
  }
  interface Project {
    id: string;
    name: string;
    description: string;
    codeURL: string | null;
    screenshotURL: string | null;
    videoURL: string | null;
    demoURL: string | null;
    team: Team;
    submittedAt: string;
    event: Event;
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
    participants: Participant[];
    checkedInParticipants: number;
    teams: Team[];
    projects: Project[];
    createdBy: string;
    createdAt: string;
  }
  //   const gradeMap = {
  //     nine: "9",
  //     ten: "10",
  //     eleven: "11",
  //     twelve: "12",
  //   };
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectId) {
          const response = await organizerGetProjectById(projectId);
          setProject(response.project);
        }
      } catch (error: unknown) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, reload]);

  useEffect(() => {
    console.log(project);
  }, [project]);

  const handleOpenEditEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (projectId) {
      openOverlay(<EditEvent eventId={projectId} setReload={setReload} />);
    }
  };

  const handleOpenDeleteEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (projectId && project) {
      openOverlay(
        <DeleteEvent
          eventId={projectId}
          eventName={project.name}
          currentPage="event"
          setReload={undefined}
        />
      );
    }
  };

  //   const handleOpenOrganizerUserView = (
  //     e: React.MouseEvent<HTMLButtonElement>,
  //     index: number
  //   ) => {
  //     e.preventDefault();
  //     if (projectId && project) {
  //       openOverlay(<OrganizerUserView user={project.participants[index]} />);
  //     }
  //   };

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
        {project ? (
          <div className="w-full sm:w-5/6 mt-5 flex flex-col mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-1">
              {project.name}
            </h1>
            <h3 className="text-center mb-3 text-lg sm:text-xl md:text-2xl italic text-primary-a2">
              {project.event.name}
            </h3>
            <div className="flex flex-col sm:flex-row bg-surface-a1 mt-2 p-4 rounded-lg box-border">
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-center p-4 box-border w-full gap-3">
                  <img
                    src={`${window.location.origin}${project.screenshotURL}`}
                    alt={`${project.name} Screenshot`}
                    className="w-1/3 h-auto rounded-lg"
                  />
                  <video
                    src={`${window.location.origin}${project.videoURL}`}
                    className="w-2/3 h-auto rounded-lg"
                    controls
                  ></video>
                </div>
                <h1 className="font-bold">Project Description</h1>
                <LinkDetectedText
                  className="text-lg mb-2"
                  text={project.description}
                />
                <div className="flex flex-row w-full mt-auto">
                  <Link
                    to={project.demoURL!}
                    className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full"
                  >
                    Project Demo
                  </Link>
                  <Link
                    to="/app/organizer/events"
                    className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold text-center w-full"
                  >
                    Back to Events
                  </Link>
                  <button
                    className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 p-1 sm:p-2 ml-2 rounded-lg font-bold w-full"
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
            </div>
            <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-2">
                Team Members ({project.team.members.length})
              </h2>
              {project.team.members.length > 0 ? (
                <table className="min-w-full bg-surface-a2 rounded-lg">
                  <thead>
                    <tr>
                      <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                        Member ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.team.members.map((p, index) => (
                      <tr key={p.id}>
                        <td
                          className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                            index % 2 === 0 ? "bg-surface-a3" : ""
                          }`}
                        >
                          {p.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center">No members yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">Event not found</h1>
            <div className="flex w-full justify-center">
              <Link
                to="/app/organizer/events"
                className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 font-bold p-2 rounded-lg"
              >
                Back to Events
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
