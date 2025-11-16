import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { judgeGetProjectById } from "../../utils/ProjectAPIHandler";
import { IoMenu } from "react-icons/io5";
import JudgeNavbar from "../../components/JudgeNavbar";

export default function JudgeProject() {
  const { projectId } = useParams() as {
    eventId: string;
    projectId: string;
  };
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
    canBeJudged: boolean;
    submittedAt: string;
  }
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const handleFetchProject = async () => {
      if (!projectId) return;
      setError("");
      try {
        const projectData = await judgeGetProjectById(projectId);
        console.log(projectData);
        setProject(projectData.project);
      } catch (error) {
        console.error("Failed to get project:", error);
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
    handleFetchProject();
  }, [projectId]);

  if (!projectId) {
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
            No Project ID
          </h1>
        </div>
      </div>
    );
  }

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

  if (!project) {
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center justify-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <div className="p-4 rounded-lg w-120 flex flex-col bg-surface-a1">
            <h1 className="text-4xl text-center font-bold">
              Error fetching project
            </h1>
            <p className="text-2xl">
              There was an error fetching the project:{" "}
              <span className="text-red-500 font-bold">{error}</span>
            </p>
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
          <div className="flex flex-col sm:flex-row bg-surface-a1 mt-2 p-4 rounded-lg">
            <div className="flex flex-col w-full sm:w-1/2">
              {project?.screenshotURL ? (
                <img
                  src={`${project.screenshotURL}`}
                  alt={`${project.name} Screenshot`}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="w-full aspect-16/9 bg-surface-a4 flex text-center justify-center items-center text-2xl font-bold rounded-lg">
                  No Image Provided
                </div>
              )}
            </div>
            <div className="flex flex-col w-full sm:w-1/2 mt-2 sm:mt-0 sm:ml-2">
              <h2 className="text-2xl font-bold text-center">{project.name}</h2>
              <p className="text-lg">{project.description}</p>
              <div className="w-full flex flex-row mt-2 sm:mt-auto gap-2">
                {project.codeURL && (
                  <a
                    href={project.codeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-2 rounded-lg bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 text-center font-bold"
                  >
                    View Code
                  </a>
                )}
                {project.demoURL && (
                  <a
                    href={project.demoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-2 rounded-lg bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 text-center font-bold"
                  >
                    View Demo
                  </a>
                )}
              </div>
            </div>
          </div>
          {project.videoURL && (
            <div className="flex flex-col mt-4 bg-surface-a1 rounded-lg p-4">
              <h2 className="text-2xl font-bold">{project.name} Demo Video</h2>
              <video controls className="mt-2 rounded-lg">
                <source src={project.videoURL} />
                Your browser doesn't support this video
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
