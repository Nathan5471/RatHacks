import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getEventById } from "../utils/EventAPIHandler";
import {
  getProjectById,
  createProject,
  updateProject,
  submitProject,
} from "../utils/ProjectAPIHandler";
import { IoMenu } from "react-icons/io5";
import AppNavbar from "../components/AppNavbar";

export default function EventSubmit() {
  const { eventId } = useParams<{ eventId: string }>();
  interface Team {
    id: string;
    joinCode: string;
    memebers: string[];
    submittedProject: boolean;
    project?: string;
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
    participantCount: number;
    team: Team | null;
  }
  const [event, setEvent] = useState<Event | null>(null);
  interface Project {
    id: string;
    name: string;
    description: string;
    codeURL: string | null;
    screenshotURL: string | null;
    videoURL: string | null;
    demoURL: string | null;
    submittedAt: string | null;
  }
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [codeURL, setCodeURL] = useState("");
  const [demoURL, setDemoURL] = useState("");
  const [screenshot, setScreenshot] = useState<File | undefined>(undefined);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const screenshotRef = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchEventAndProject = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }
      let eventData;
      try {
        eventData = (await getEventById(eventId)) as {
          message: string;
          event: Event;
        };
        setEvent(eventData.event);
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoading(false);
        return;
      }
      if (
        eventData.event.status === "upcoming" ||
        eventData.event.status === "completed" ||
        !eventData.event.team ||
        !eventData.event.team.project ||
        eventData.event.team.submittedProject
      ) {
        setLoading(false);
        return;
      }
      try {
        const projectData = (await getProjectById(
          eventData.event.team.project
        )) as { message: string; project: Project };
        if (!projectData) {
          setLoading(false);
          return;
        }
        setProject(projectData.project);
        setName(projectData.project.name);
        setDescription(projectData.project.description);
        setCodeURL(
          projectData.project.codeURL ? projectData.project.codeURL : ""
        );
        setDemoURL(
          projectData.project.demoURL ? projectData.project.demoURL : ""
        );
        setScreenshotPreview(projectData.project.screenshotURL);
        setVideoPreview(projectData.project.videoURL);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
        return;
      }
    };
    fetchEventAndProject();
  }, [eventId]);

  const handleChangeScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setScreenshot(file);
    } else {
      setScreenshot(undefined);
      setScreenshotPreview(null);
    }
  };

  const triggerScreenshotInput = () => {
    screenshotRef.current?.click();
  };

  const handleChangeVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setVideo(file);
    } else {
      setVideo(undefined);
      setVideoPreview(null);
    }
  };

  const triggerVideoInput = () => {
    videoRef.current?.click();
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!eventId) return;
    try {
      const response = (await createProject({
        name,
        description,
        codeURL,
        demoURL,
        screenshot,
        video,
        eventId,
      })) as { message: string; projectId: string };
      toast.success("Created project successfully!");
      const projectData = (await getProjectById(response.projectId)) as {
        message: string;
        project: Project;
      };
      setProject(projectData.project);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
      toast.error("Failed to create project");
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!project) return;
    try {
      await updateProject(project.id, {
        name,
        description,
        codeURL,
        demoURL,
        screenshot,
        video,
      });
      toast.success("Project updated successfully!");
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
      toast.error("Failed to update project");
    }
  };

  const handleSubmitProject = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setError("");
    if (!project || !eventId) return;
    try {
      await submitProject(project.id);
      toast.success("Project submitted successfully!");
      const eventData = (await getEventById(eventId)) as {
        message: string;
        event: Event;
      };
      setEvent(eventData.event);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occured";
      setError(errorMessage);
      toast.error("Failed to submit project");
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <h1 className="text-4xl text-center">Event Project</h1>
          <p className="mt-4 text-lg">Loading...</p>
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
          <div className="flex flex-col p-4 rounded-lg bg-surface-a1">
            <h2 className="text-4xl text-center">Event not found</h2>
            <p className="mt-4">
              You can submit to a project that doesn't exist!
            </p>
            <Link
              to="/app/events"
              className="p-2 text-center bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 rounded-lg mt-2"
            >
              Back to events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (
    event.status !== "ongoing" ||
    new Date().getTime() > new Date(event.submissionDeadline).getTime()
  ) {
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
          <div className="flex flex-col p-4 rounded-lg bg-surface-a1">
            <h2 className="text-4xl text-center">
              {event.status === "ongoing"
                ? "Event hasn't started"
                : "Submission deadline has passed"}
            </h2>
            <p className="mt-4">
              {event.status === "upcoming"
                ? "You can't submit a project to an event that hasn't started!"
                : "You can't submit a project after the submission deadline!"}
            </p>
            <Link
              to={`/app/event/${eventId}`}
              className="p-2 text-center bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 rounded-lg mt-2"
            >
              Back to event
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event.team) {
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
          <div className="flex flex-col p-4 rounded-lg bg-surface-a1">
            <h2 className="text-4xl text-center">Not apart of the event</h2>
            <p className="mt-4">
              You can't submit a project since you aren't in the event!
            </p>
            <Link
              to={`/app/event/${eventId}`}
              className="p-2 text-center bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 rounded-lg mt-2"
            >
              Back to event
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (event.team.submittedProject) {
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
          <div className="flex flex-col p-4 rounded-lg bg-surface-a1">
            <h2 className="text-4xl text-center">Project already submitted!</h2>
            <p className="mt-4">
              You project is already submitted! You're good to go!
            </p>
            <Link
              to={`/app/event/${eventId}`}
              className="p-2 text-center bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 rounded-lg mt-2"
            >
              Back to event
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
        <form
          className="flex flex-col p-4 w-85 sm:w-120 rounded-lg bg-surface-a1"
          onSubmit={project ? handleUpdateProject : handleCreateProject}
        >
          <h2 className="text-3xl font-bold text-center mb-2">
            {project && "Create"} Project for {event.name}
          </h2>
          <label htmlFor="name" className="text-2xl mt-2">
            Project Name
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
          <label htmlFor="codeURL" className="text-2xl mt-2">
            Code URL (optional, required to submit)
          </label>
          <input
            type="text"
            id="codeURL"
            name="codeURL"
            value={codeURL}
            onChange={(e) => setCodeURL(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          />
          <label htmlFor="demoURL" className="text-2xl mt-2">
            Demo URL (optional, not required to submit)
          </label>
          <input
            type="text"
            id="demoURL"
            name="demoURL"
            value={demoURL}
            onChange={(e) => setDemoURL(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 w-full mt-1"
          />
          <label htmlFor="screenshot" className="text-2xl mt-2">
            Screenshot (optional, required to submit)
          </label>
          <input
            type="file"
            accept="image/*"
            id="screenshot"
            name="screenshot"
            onChange={handleChangeScreenshot}
            ref={screenshotRef}
            className="hidden"
          />
          {screenshotPreview ? (
            <div className="relative w-full aspect-video group mt-1">
              <img
                src={screenshotPreview}
                alt="Select Screenshot Preview"
                onClick={triggerScreenshotInput}
                className="w-full aspect-video object-cover"
              />
              <div
                onClick={triggerScreenshotInput}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/35 flex cursor-point items-center justify-center"
              >
                <span className="text-gray-200/0 font-medium text-3xl group-hover:text-gray-200">
                  Change Image
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerScreenshotInput}
              className="flex w-full aspect-video bg-surface-a2 hover:bg-surface-a3 items-center justify-center text-center mt-1"
            >
              <p className="text-2xl">Upload Screenshot</p>
            </div>
          )}
          <label htmlFor="video" className="text-2xl mt-2">
            Video (optional, required to submit)
          </label>
          <p className="text-lg">
            Please use{" "}
            <a
              href="https://tools.rotato.app/compress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-a0 spooky:text-spooky-a0 hover:underline break-all"
            >
              https://tools.rotato.app/compress
            </a>{" "}
            to compress your video.
          </p>
          <input
            type="file"
            accept="video/*"
            id="video"
            name="video"
            onChange={handleChangeVideo}
            ref={videoRef}
            className="hidden"
          />
          {videoPreview ? (
            <div className="relative w-full aspect-video group mt-1">
              <video
                src={videoPreview}
                onClick={triggerVideoInput}
                className="w-full aspect-video object-cover"
                autoPlay
                loop
              />
              <div
                onClick={triggerVideoInput}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/35 flex cursor-point items-center justify-center"
              >
                <span className="text-gray-200/0 font-medium text-3xl group-hover:text-gray-200">
                  Change Video
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerVideoInput}
              className="flex w-full aspect-video bg-surface-a2 hover:bg-surface-a3 items-center justify-center text-center mt-1"
            >
              <p className="text-2xl">Upload Video</p>
            </div>
          )}
          {error && (
            <p className="text-red-500 text-lg mt-2 text-center">{error}</p>
          )}
          {project && (
            <p className="text-lg mt-2 text-center">
              Make sure to save FIRST if you made changes BEFORE submitting!
            </p>
          )}
          {!project && (
            <button
              type="submit"
              className="w-full bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 p-2 rounded-lg font-bold mt-2"
            >
              Create Project
            </button>
          )}
          {project && (
            <div className="flex flex-row w-full mt-2">
              <button
                type="submit"
                className="w-full bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 p-2 rounded-lg font-bold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleSubmitProject}
                className="w-full bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 p-2 rounded-lg font-bold ml-2"
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="dark"
        pauseOnHover={false}
      />
    </div>
  );
}
