import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../contexts/AuthContext";

export default function PastEvents() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen w-screen bg-surface-a0 text-white overflow-y-auto">
      <div className="flex flex-row min-h-15 w-screen bg-surface-a1 shadow-lg">
        <a
          className="text-lg sm:text-3xl col-span-3 md:col-span-1 font-bold text-center justify-center text-primary-a0 p-4"
          href="/"
        >
          Rat Hacks
        </a>
        <HashLink
          to="/#about"
          className="ml-auto text-pretty sm:text-lg lg:text-xl p-2 sm:p-4 hover:underline items-center flex font-bold"
        >
          About
        </HashLink>
        <HashLink
          to="/#schedule"
          className="text-pretty sm:text-lg lg:text-xl p-2 sm:p-4 hover:underline items-center flex font-bold"
        >
          Schedule
        </HashLink>
        <HashLink
          to="/#faq"
          className="text-pretty sm:text-lg lg:text-xl p-2 sm:p-4 hover:underline items-center flex font-bold"
        >
          FAQ
        </HashLink>
        <Link
          to={user ? "/app" : "/login"}
          className="text-pretty sm:text-lg lg:text-xl bg-primary-a0 hover:bg-primary-a1 rounded-lg text-center justify-center items-center flex font-bold m-4 p-2 w-1/6"
        >
          {user ? "Go to App" : "Login"}
        </Link>
      </div>
      <div className="flex flex-col items-center w-screen h-full overflow-y-auto">
        <h2 className="text-2xl sm:text-5xl mt-6 text-center font-bold">
          Past Events
        </h2>
        <div className="flex flex-col bg-surface-a1 w-full h-full p-4">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-primary-a0">Rat Hacks: CTF</span> -
            May 23, 2026 (10:00 AM - 5:00 PM)
          </h3>
          <p className="sm:text-lg mb-4">Participants: 5</p>
          <p className="text-lg sm:text-xl">
            Rat Hacks: Capture The Flag 2026 is the first Capture The Flag
            hosted by the Rat Hacks team at the Roanoke Valley Governor's
            School. Lunch was the classic Chick-fil-A chicken nuggets! Everyone
            solved tons of challenges and had a great time.
          </p>
        </div>
        <div className="flex flex-col bg-[#53BFFF] w-full h-full p-4">
          <h3 className="text-xl sm:text-3xl font-dream-planner mb-1">
            <span className="font-bold">CAMPFIRE ROANOKE</span> - FEBRUARY 28 -
            MARCH 1, 2026 (12:00 PM - 12:00 PM)
          </h3>
          <p className="sm:text-lg font-ember-fire mb-4">Participants: 11</p>
          <p className="text-lg sm:text-xl font-ember-fire">
            Campfire Roanoke was the first overnight high school game jam in
            Roanoke hosted at the Science Museum of Western Virgiinia by the Rat
            Hacks team! Participants were allowed to work in groups of up to 3
            to make a game around the theme "Beneath the Surface". Every team
            was able to submit a game, while eating awesome food from Jersey
            Mikes, Chick-fil-A, Domino's, and Sam's Club! The highlight from the
            event was the opening ceremony held in the eye planetarium.
          </p>
        </div>
        <div className="flex flex-col bg-surface-a1 w-full h-full p-4">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-primary-a0">Rat Hacks</span> -
            November 22, 2025 (8:00 AM - 8:00 PM)
          </h3>
          <p className="sm:text-lg mb-4">Participants: 17</p>
          <p className="text-lg sm:text-xl">
            This is the second hackathon hosted by Rat Hacks at the Roanoke
            Valley Governor's School. Participants worked in groups of up to 4
            to make a coding project in 12 hours around the theme "Something to
            Improve your Life". For lunch and dinner, we had Chick-fil-A and
            Domino's. Everyone was able to submit a project.
          </p>
        </div>
        <div className="flex flex-col bg-[#f4f4f4ff] w-full h-full p-4 text-black">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-[#144922ff]">Rat Hacks</span> -
            November 22, 2025 (8:00 AM - 8:00 PM)
          </h3>
          <p className="sm:text-lg mb-4">Participants: 14</p>
          <p className="text-lg sm:text-xl">
            This was the FIRST EVER RAT HACKS!!! This is the first hackathon
            available to high schoolers in the area hosted at the Roanoke Valley
            Governor's School. Participants worked in groups of up to 4 to make
            a coding project in 12 hours around the theme "Education Tools."
            This was also the start of our tradition of having a Ping Pong
            tournament during the hackathon. Lunch was Chick-fil-A and dinner
            was pizza from Domino's.
          </p>
        </div>
        <div className="flex flex-col items-center p-4 w-screen h-full bg-surface-a1 mt-6">
          <p className="text-center sm:text-lg">
            {"Made with <3 by the Rat Hacks Team!"}
          </p>
          <div className="flex flex-row mt-2">
            <a
              href="https://github.com/Nathan5471/RatHacks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/github.svg"
                alt="GitHub"
                className="w-10 hover:w-12 h-10 hover:h-12 mx-2"
              />
            </a>
            <a
              href="https://discord.rathacks.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/discord.svg"
                alt="Discord"
                className="w-10 hover:w-12 h-10 hover:h-12 mx-2"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
