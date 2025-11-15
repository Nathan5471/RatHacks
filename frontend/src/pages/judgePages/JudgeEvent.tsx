import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { judgeGetEventById } from "../../utils/EventAPIHandler";
import { formatDate } from "date-fns";
import { IoMenu } from "react-icons/io5";
import JudgeNavbar from "../../components/JudgeNavbar";
import LinkDetectedText from "../../components/LinkDetectedText";

export default function JudgeEvent() {
  const { eventId } = useParams();
  interface Project {
    id: string;
    name: string;
    description: string;
    codeURL: string | null;
    screenshotURL: string | null;
    videoURL: string | null;
    demoURL: string;
    team: string[];
    judged: boolean;
    submittedAt: string;
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
    releasedJudging: boolean;
    participantCount: number;
    projects: Project[];
  }
  const [event, setEvent] = useState<Event | null>(null);
  const [projectFilter, setProjectFilter] = useState<
    "notJudged" | "judged" | "all"
  >("notJudged");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (eventId) {
          const data = await judgeGetEventById(eventId);
          setEvent(data.event);
          setFilteredProjects(
            data.event.projects.filter((project: Project) => !project.judged)
          );
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (event) {
      let projects = event.projects;
      if (projectFilter === "notJudged") {
        projects = projects.filter((project) => !project.judged);
      } else if (projectFilter === "judged") {
        projects = projects.filter((project) => project.judged);
      }
      setFilteredProjects(projects);
    }
  }, [projectFilter, event]);

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
            <JudgeNavbar />
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  if (!event) {
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
            <JudgeNavbar />
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
          <div className="flex flex-col items-center mt-20 bg-surface-a1 p-6 rounded-lg">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Event Not Found
            </h1>
            <p className="text-lg mt-8">
              An error occurred or the event does not exist.
            </p>
            <Link
              to="/app/judge/events"
              className="mt-4 w-45 bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 p-2 rounded-lg font-bold text-center"
            >
              Back to Events
            </Link>
          </div>
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
          <JudgeNavbar />
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
        <div className="w-full sm:w-5/6 mt-5 flex flex-col mb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            {event.name}
          </h1>
          <div className="flex flex-col sm:flex-row bg-surface-a1 mt-2 p-4 rounded-lg">
            <div className="flex flex-col w-full sm:w-2/3">
              <LinkDetectedText
                className="text-lg mb-2"
                text={event.description}
              />
              <Link
                to="/app/judge/events"
                className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 p-1 sm:p-2 rounded-lg font-bold text-center w-full mt-auto"
              >
                Back to Events
              </Link>
            </div>
            <div className="flex flex-col w-full sm:w-1/3 sm:ml-2">
              <p>
                <span className="font-bold">Status:</span> {event.status}
              </p>
              <span className="font-bold">Location:</span> {event.location}
              <span className="font-bold">Start Date:</span>{" "}
              {formatDate(
                new Date(event.startDate),
                "EEEE, MMMM d yyyy h:mm a"
              )}
              <span className="font-bold">End Date:</span>{" "}
              {formatDate(new Date(event.endDate), "EEEE, MMMM d yyyy h:mm a")}
              <span className="font-bold">Submission Deadline:</span>{" "}
              {formatDate(
                new Date(event.submissionDeadline),
                "EEEE, MMMM d yyyy h:mm a"
              )}
              <p>
                <span className="font-bold">Participants:</span>{" "}
                {event.participantCount}
              </p>
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <h2 className="text-xl font-bold mb-2">Projects to Judge</h2>
            <div className="flex flex-row mb-4">
              <button
                className={`p-2 rounded-lg ${
                  projectFilter === "notJudged"
                    ? "bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1"
                    : "bg-surface-a1 hover:bg-surface-a2"
                }`}
                onClick={() => setProjectFilter("notJudged")}
              >
                Not Judged
              </button>
              <button
                className={`ml-2 p-2 rounded-lg ${
                  projectFilter === "judged"
                    ? "bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1"
                    : "bg-surface-a1 hover:bg-surface-a2"
                }`}
                onClick={() => setProjectFilter("judged")}
              >
                Judged
              </button>
              <button
                className={`ml-2 p-2 rounded-lg ${
                  projectFilter === "all"
                    ? "bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1"
                    : "bg-surface-a1 hover:bg-surface-a2"
                }`}
                onClick={() => setProjectFilter("all")}
              >
                All
              </button>
            </div>
            {filteredProjects.length === 0 ? (
              <p className="text-lg">No projects for this filter.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-surface-a1 p-4 rounded-lg"
                  >
                    {project.screenshotURL && (
                      <img
                        src={`${window.location.origin}${project.screenshotURL}`}
                        alt={`${project.name} Screenshot`}
                        className="w-full h-auto mb-2 rounded-lg"
                      />
                    )}
                    <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                    <p className="mb-2">{project.description}</p>
                    <Link
                      to={`/app/judge/event/${event.id}/project/${project.id}`}
                      className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1s p-2 rounded-lg font-bold text-center"
                    >
                      {project.judged === false
                        ? "Judge Project"
                        : "View Project"}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
