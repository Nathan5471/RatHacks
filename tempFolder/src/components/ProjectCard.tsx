import { Link } from "react-router-dom";

export default function ProjectCard({
  project,
}: {
  project: {
    id: string;
    title: string;
    hackers: string[];
    codeLink: string;
    videoLink: string;
    description: string;
    technologies: string;
    other: string;
  };
}) {
  return (
    <div className="flex flex-col bg-surface-a1 p-4 rounded-lg shadow-lg m-4">
      <h3 className="text-2xl font-semibold text-primary-a1">
        {project.title}
      </h3>
      <p className="text-sm text-gray-400">{project.hackers.join(", ")}</p>
      <p className="text-lg text-white mt-2 mb-2 max-h-40 overflow-y-auto">
        {project.description}
      </p>
      <div className="flex mt-auto justify-center">
        <Link
          to={`/projects/${project.id}`}
          className="bg-primary-a0 hover:bg-primary-a1 rounded-lg font-bolt text-lg p-2 shadow-lg text-white"
        >
          View Project
        </Link>
      </div>
    </div>
  );
}
