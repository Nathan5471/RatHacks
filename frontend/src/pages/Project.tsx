import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../utils/ProjectAPIHandler";
import { IoMenu } from "react-icons/io5";
import AppNavbar from "../components/AppNavbar";

export default function OrganizerProject() {
  const { projectId } = useParams();
  interface JudgeFeedback {
    id: string;
    judge: string; // FirstName LastName
    creativityScore: number;
    functionalityScore: number;
    technicalityScore: number;
    interfaceScore: number;
    totalScore: number;
    feedback: string;
  }
  interface Project {
    id: string;
    name: string;
    description: string;
    codeURL: string | null;
    screenshotURL: string | null;
    videoURL: string | null;
    demoURL: string | null;
    members: string[];
    event: {
      id: string;
      name: string;
    };
    judgeFeedback: JudgeFeedback[];
  }
  const [project, setProject] = useState<Project | null>(null);
  const [selectedJudgeFeedback, setSelectedJudgeFeedback] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        try {
          const projectData = await getProjectById(projectId);
          setProject(projectData.project);
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
      }
    };
    fetchProject();
  }, [projectId]);

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
          <h1 className="text-4xl">Loading...</h1>
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
          <div className="bg-surface-a1 flex flex-col p-4 rounded-lg">
            <h1 className="text-2xl mb-4">Project not found</h1>
          </div>
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
        <div className="flex flex-col ml-6 md:ml-0 w-[calc(100%-1.5rem)] md:w-4/5 lg:w-5/6 h-full overflow-y-auto p-4 items-center">
          <button
            className={`absolute top-4 left-4 md:hidden ${
              navbarOpen ? "hidden" : ""
            }`}
            onClick={() => setNavbarOpen(true)}
          >
            <IoMenu className="text-3xl hover:text-4xl" />
          </button>
          <div className="bg-surface-a1 flex flex-col p-4 rounded-lg">
            <h1 className="text-2xl mb-4">An error occurred</h1>
            <p className="text-lg text-red-500">Error message: {error}</p>
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
              <p className="text-sm text-surface-a4">
                Made by{" "}
                {project.members.map((member, index) => {
                  if (project.members.length === 1) {
                    <span key={index}>{member}</span>;
                  }
                  if (index === project.members.length - 1) {
                    return <span key={index}>{member}</span>;
                  }
                  if (index === project.members.length - 2) {
                    return (
                      <span key={index}>
                        {member}
                        {project.members.length > 2 ? "," : ""} and{" "}
                      </span>
                    );
                  }
                  return <span key={index}>{member}, </span>;
                })}
              </p>
              <p className="text-lg">{project.description}</p>
              <div className="w-full flex flex-row mt-2 sm:mt-auto gap-2">
                {project.codeURL && (
                  <a
                    href={project.codeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-2 rounded-lg bg-primary-a0 hover:bg-primary-a1 text-center font-bold"
                  >
                    View Code
                  </a>
                )}
                {project.demoURL && (
                  <a
                    href={project.demoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-2 rounded-lg bg-primary-a0 hover:bg-primary-a1 text-center font-bold"
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
          {project.judgeFeedback.length > 0 && (
            <div className="flex flex-col mt-4 bg-surface-a1 rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-2">Judge Feedback</h2>
              <div className="flex flex-row mb-2 w-full gap-2 overflow-x-auto">
                {project.judgeFeedback.map((feedback, index) => (
                  <button
                    key={feedback.id}
                    className={`p-2 rounded-lg w-1/3 md:w-1/4 text-center font-bold ${
                      index === selectedJudgeFeedback
                        ? "bg-primary-a0 hover:bg-primary-a1"
                        : "bg-surface-a2 hover:bg-surface-a3"
                    }`}
                    onClick={() => setSelectedJudgeFeedback(index)}
                  >
                    {feedback.judge}
                  </button>
                ))}
              </div>
              <div className="flex flex-col">
                <p>
                  <span className="font-bold">Creativity Score:</span>{" "}
                  {project.judgeFeedback[selectedJudgeFeedback].creativityScore}
                </p>
                <p>
                  <span className="font-bold">Functionality Score:</span>{" "}
                  {
                    project.judgeFeedback[selectedJudgeFeedback]
                      .functionalityScore
                  }
                </p>
                <p>
                  <span className="font-bold">Technicality Score:</span>{" "}
                  {
                    project.judgeFeedback[selectedJudgeFeedback]
                      .technicalityScore
                  }
                </p>
                <p>
                  <span className="font-bold">Interface Score:</span>{" "}
                  {project.judgeFeedback[selectedJudgeFeedback].interfaceScore}
                </p>
                <p>
                  <span className="font-bold">Total Score:</span>{" "}
                  {project.judgeFeedback[selectedJudgeFeedback].totalScore}
                </p>
                <p className="mt-2">
                  <span className="font-bold">Feedback:</span>{" "}
                  {project.judgeFeedback[selectedJudgeFeedback].feedback}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
