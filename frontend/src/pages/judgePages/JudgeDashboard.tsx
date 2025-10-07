import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import JudgeNavbar from "../../components/JudgeNavbar";

export default function JudgeDashboard() {
  const [navbarOpen, setNavbarOpen] = useState(false);

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
          Dashboard
        </h1>
        <div className="flex flex-col mt-6 p-4 w-5/6 lg:w-2/3 bg-surface-a1 rounded-lg items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Judging Criteria
          </h2>
          <h3 className="text-lg sm:text-xl font-semibold mt-4 text-left w-full">
            Creativity (1-10 points)
          </h3>
          <p className="sm:text-lg text-left w-full">
            How creative is this project? There are many ways a project can be
            creative: is the idea original, is this a clever interpretation of
            the theme, does it use a creative approach to solve a problem, etc.
            5 points should be an average score. 1 point is like the least
            create project ever and it doesn't really follow the theme. 10
            points is for the a very creative project that really has a special
            idea or twist.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold mt-4 text-left w-full">
            Functionality (1-10 points)
          </h3>
          <p className="sm:text-lg text-left w-full">
            How well does the project work? Does it do all of the functions it
            is supposed to? How many bugs are there? Remember, take into
            consideration the time of the event. 5 points should be the an
            average score. Something that works well but has some bugs or is
            missing features. 1 point is for a project that just doesn't work or
            barely functions. 10 points is for a project that offers minor bugs
            and many features.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold mt-4 text-left w-full">
            Technicality (1-10 points)
          </h3>
          <p className="sm:text-lg text-left w-full">
            How technically impressive is this project? Remember to take into
            consideration the time of the event. This could be things like how
            impressive is a feature they implemented or how efficient it is.
            Just something that would be really cool and something you could
            nerd out about. 5 points should be an average score. 1 point is for
            a project that is not technically impressive at all. 10 points is
            for a project that has some really impressive technical features or
            implementations.
          </p>
          <h3 className="text-lg sm:text-xl font-semibold mt-4 text-left w-full">
            Interface (1-10 points)
          </h3>
          <p className="sm:text-lg text-left w-full">
            How good is the user interface of the project? This interface is
            arguably one of the most important parts of a project because it is
            what you interact with. A good interface is intuitive, easy to use,
            and pleasant looking. 5 points is for an average interface that is
            fairly easy to use and looks okay. 1 point is for an interface that
            makes absolutely no sense to use and is incredibly ugly. 10 points
            is for a stand out interface that is very intuitive and pretty.
          </p>
        </div>
      </div>
    </div>
  );
}
