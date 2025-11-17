import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  judgeGetProjectById,
  judgeProject,
} from "../../utils/ProjectAPIHandler";
import { IoMenu } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import JudgeNavbar from "../../components/JudgeNavbar";

export default function JudgeProject() {
  const { projectId } = useParams() as {
    projectId: string;
  };
  interface JudgeFeedback {
    id: string;
    judgeId: string;
    projectId: string;
    creativityScore: number;
    functionalityScore: number;
    technicalityScore: number;
    interfaceScore: number;
    feedback: string;
    totalScore: number;
    createdAt: string;
  }
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
    judgeFeedback: JudgeFeedback | null;
    submittedAt: string;
  }
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creativityScore, setCreativityScore] = useState(5);
  const [functionalityScore, setFunctionalityScore] = useState(5);
  const [technicalityScore, setTechnicalityScore] = useState(5);
  const [interfaceScore, setInterfaceScore] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const handleFetchProject = async () => {
      if (!projectId) return;
      setError("");
      try {
        const projectData = await judgeGetProjectById(projectId);
        setProject(projectData.project);
        if (projectData.project.judgeFeedback) {
          setCreativityScore(projectData.project.judgeFeedback.creativityScore);
          setFunctionalityScore(
            projectData.project.judgeFeedback.functionalityScore
          );
          setTechnicalityScore(
            projectData.project.judgeFeedback.technicalityScore
          );
          setInterfaceScore(projectData.project.judgeFeedback.interfaceScore);
          setFeedback(projectData.project.judgeFeedback.feedback);
        }
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

  const handleJudgeProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    try {
      await judgeProject(projectId, {
        creativityScore,
        functionalityScore,
        technicalityScore,
        interfaceScore,
        feedback,
      });
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      console.error("Failed to judge project:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      toast.error(`Failed to submit feedback: ${errorMessage}`);
    }
  };

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
          {(project.judgeFeedback || project.canBeJudged) && (
            <form
              className="flex flex-col mt-4 bg-surface-a1 rounded-lg p-4"
              onSubmit={handleJudgeProject}
            >
              <h2 className="text-2xl font-bold">
                {project.judgeFeedback ? "Your Feedback" : "Judge Project"}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <label htmlFor="creativityScore" className="text-xl mt-2">
                  Creativity Score (1-10):
                </label>
                <input
                  type="number"
                  id="creativityScore"
                  name="creativityScore"
                  min={1}
                  max={10}
                  value={creativityScore}
                  onChange={(e) => setCreativityScore(Number(e.target.value))}
                  className="w-full col-span-2 p-2 rounded-lg bg-surface-a2 font-bold text-lg"
                />
                <label htmlFor="functionalityScore" className="text-xl mt-2">
                  Functionality Score (1-10):
                </label>
                <input
                  type="number"
                  id="functionalityScore"
                  name="functionalityScore"
                  min={1}
                  max={10}
                  value={functionalityScore}
                  onChange={(e) =>
                    setFunctionalityScore(Number(e.target.value))
                  }
                  className="w-full col-span-2 p-2 rounded-lg bg-surface-a2 font-bold text-lg"
                />
                <label htmlFor="technicalityScore" className="text-xl mt-2">
                  Technicality Score (1-10):
                </label>
                <input
                  type="number"
                  id="technicalityScore"
                  name="technicalityScore"
                  min={1}
                  max={10}
                  value={technicalityScore}
                  onChange={(e) => setTechnicalityScore(Number(e.target.value))}
                  className="w-full col-span-2 p-2 rounded-lg bg-surface-a2 font-bold text-lg"
                />
                <label htmlFor="interfaceScore" className="text-xl mt-2">
                  Interface Score (1-10):
                </label>
                <input
                  type="number"
                  id="interfaceScore"
                  name="interfaceScore"
                  min={1}
                  max={10}
                  value={interfaceScore}
                  onChange={(e) => setInterfaceScore(Number(e.target.value))}
                  className="w-full col-span-2 p-2 rounded-lg bg-surface-a2 font-bold text-lg"
                />
              </div>
              <label htmlFor="feedback" className="text-xl mt-4">
                Feedback:
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full h-32 p-2 rounded-lg bg-surface-a2 text-lg mt-2"
              />
              {project.canBeJudged && (
                <div className="flex flex-row mt-2">
                  <button
                    type="submit"
                    className="w-full p-2 rounded-lg bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 font-bold text-lg"
                  >
                    {project.judgeFeedback
                      ? "Update Feedback"
                      : "Submit Feedback"}
                  </button>
                  {project.judgeFeedback && (
                    <button
                      type="button"
                      className="w-full ml-2 p-2 rounded-lg bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 space:bg-space-a0 space:hover:bg-space-a1 font-bold text-lg"
                      onClick={() => {
                        setCreativityScore(
                          project.judgeFeedback!.creativityScore
                        );
                        setFunctionalityScore(
                          project.judgeFeedback!.functionalityScore
                        );
                        setTechnicalityScore(
                          project.judgeFeedback!.technicalityScore
                        );
                        setInterfaceScore(
                          project.judgeFeedback!.interfaceScore
                        );
                        setFeedback(project.judgeFeedback!.feedback);
                      }}
                    >
                      Reset Feedback
                    </button>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
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
