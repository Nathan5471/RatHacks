import { Link } from "react-router-dom";
import data from "../data/projects.json";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const projects = data.projects;

  return (
    <div className="flex flex-col min-h-screen w-screen bg-surface-a0 text-white">
      <div className="grid grid-cols-3 min-h-15 w-screen bg-surface-a1 shadow-lg">
        <div></div>
        <h1 className="text-3xl font-bold text-center text-primary-a0 p-4">
          Rat Hacks
        </h1>
        <Link
          to="/"
          className="bg-primary-a0 hover:bg-primary-a1 rounded-lg text-center font-bold ml-auto m-4 p-2 w-1/3 text-xl"
        >
          Home
        </Link>
      </div>
      <h2 className="text-4xl font-semibold text-center p-5">Rat Hacks</h2>
      {projects.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 p-10">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-2xl text-center p-5">
          No projects available at the moment. Please check back later!
        </p>
      )}
    </div>
  );
}
