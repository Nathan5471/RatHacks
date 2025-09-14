import { useParams, Link } from "react-router-dom";
import data from "../data/projects.json";

export default function ProjectView() {
  const { id } = useParams();
  const project = data.projects.find((proj) => proj.id === id);

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen w-screen bg-surface-a0 text-white">
        <div className="flex min-h-15 w-screen bg-surface-a1 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-primary-a0 p-4">
            Rat Hacks
          </h1>
        </div>
        <p className="text-2xl text-center p-5">Project not found.</p>
        <Link
          to="/projects"
          className="bg-primary-a0 hover:bg-primary-a1 font-bold text-white text-2xl rounded-lg text-center w-80 p-3 ml-auto mr-auto"
        >
          Go back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-screen bg-surface-a0 text-white items-center">
      <div className="min-h-15 w-screen bg-surface-a1 shadow-lg">
        <h1 className="text-3xl font-bold text-center text-primary-a0 p-4">
          Rat Hacks
        </h1>
      </div>
      <div className="flex flex-col justify-center w-11/12 sm:w-3/4 md:w-1/2">
        <h2 className="text-4xl font-semibold text-center p-5">
          {project.title}
        </h2>
        <div className="flex justify-center">
          <video className="h-auto mt-5" controls>
            <source src={project.videoLink} type="video/mp4" />
            Your browser does not support the video tag
          </video>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-gray-400">Made by {project.hackers.join(", ")}</p>
          <h3 className="text-2xl font-semibold text-primary-a1 mt-4">
            Description
          </h3>
          <p className="text-lg text-white mb-2">{project.description}</p>
          <h3 className="text-2xl font-semibold text-primary-a1 mt-4">
            Technologies
          </h3>
          <p className="text-lg text-white mb-2">{project.technologies}</p>
          {project.other !== "" && (
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-semibold text-primary-a1 mt-4">
                Other
              </h3>
              <p className="text-lg text-white mb-2">{project.other}</p>
            </div>
          )}
          <div className="flex flex-row mt-5 mb-3">
            <Link
              to="/projects"
              className="bg-primary-a0 hover:bg-primary-a1 font-bold text-lg rounded-lg p-2 shadow-lg mr-4"
            >
              Back to projects
            </Link>
            <a
              href={project.codeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-a0 font-bold text-lg rounded-lg p-2 shadow-lg"
            >
              View code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
