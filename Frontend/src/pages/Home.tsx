import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-surface-a0 text-white">
      <div className="grid grid-cols-4 md:grid-cols-3 min-h-15 min-w-screen bg-surface-a1 shadow-lg">
        <div className="hidden md:block"></div>
        <h1 className="text-3xl col-span-3 md:col-span-1 font-bold text-center text-primary-a0 p-4">
          Rat Hacks
        </h1>
        <Link
          to={user ? "/app" : "/login"}
          className="text-lg lg:text-xl bg-primary-a0 hover:bg-primary-a1 rounded-lg text-center font-bold ml-auto m-4 p-2 w-11/12 md:w-1/3"
        >
          {user ? "Go to App" : "Login"}
        </Link>
      </div>
      <h2 className="text-4xl font-semibold text-center p-5">
        A look back at Rat Hacks 2025
      </h2>
      <p className="text-2xl text-center p-5">
        Rat Hacks brought together high school hackers from multiple schools to
        collaborate on projects around the theme of "Education Tools"
      </p>
      <div className="grid grid-cols-3 gap-4 p-10">
        <div className="bg-surface-a1 p-4 rounded-lg shadow-lg">
          <h3 className="text-4xl sm:text-6xl font-semibold text-primary-a1 text-center">
            12
          </h3>
          <p className="text-lg sm:text-2xl text-center">Hours</p>
        </div>
        <div className="bg-surface-a1 p-4 rounded-lg shadow-lg">
          <h3 className="text-4xl sm:text-6xl font-semibold text-primary-a1 text-center">
            14
          </h3>
          <p className="text-lg sm:text-2xl text-center">Hackers</p>
        </div>
        <div className="bg-surface-a1 p-4 rounded-lg shadow-lg">
          <h3 className="text-4xl sm:text-6xl font-semibold text-primary-a1 text-center">
            7
          </h3>
          <p className="text-lg sm:text-2xl text-center">Projects</p>
        </div>
      </div>
      <h2 className="text-4xl font-semibold text-center p-5">
        See you next year!
      </h2>
      <div className="flex justify-center">
        <Link
          to="/projects"
          className="bg-primary-a0 hover:bg-primary-a1 font-bold text-white text-2xl rounded-lg text-center p-3 m-5 shadow-lg"
        >
          Look at this year's projects
        </Link>
      </div>
    </div>
  );
}
