import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const eventDate = new Date("2026-05-23T10:00:00");
      const difference = eventDate.getTime() - now.getTime();

      if (difference <= 0) return null;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return { days, hours, minutes, seconds };
    };

    const updateTimeRemaining = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(updateTimeRemaining);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-surface-a0 text-white overflow-y-auto">
      <div className="flex flex-row min-h-15 w-screen bg-surface-a1 shadow-lg">
        <h1 className="text-lg sm:text-3xl col-span-3 md:col-span-1 font-bold text-center justify-center text-primary-a0 p-4">
          Rat Hacks
        </h1>
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
          Rat Hacks 2026 is Coming Soon!
        </h2>
        <p className="text-xl sm:text-3xl mt-4 text-center w-3/4">
          Check out our past events here:{" "}
          <Link to="/past-events" className="text-primary-a0 hover:underline">
            Past Events
          </Link>
        </p>
        <h2 className="text-4xl font-bold mt-6 mb-4">Meet the Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
          <div className="flex flex-col p-4 bg-surface-a1 rounded-lg">
            <img
              src="/nathanCloutier.jpg"
              alt="Nathan Cloutier"
              className="w-full h-56 object-cover rounded-lg mb-2"
            />
            <span className="text-lg sm:text-xl font-bold">
              Nathan Cloutier
            </span>
            <span className="sm:text-lg">Rat Hacks Director</span>
          </div>
          <div className="flex flex-col p-4 bg-surface-a1 rounded-lg">
            <img
              src="/bearTyree.jpg"
              alt="Bear Tyree"
              className="w-full h-56 object-cover rounded-lg mb-2"
            />
            <span className="text-lg sm:text-xl font-bold">Bear Tyree</span>
            <span className="sm:text-lg">Rat Hacks Organizer</span>
          </div>
          <a
            href="https://cayleb247.github.io/personal-website/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-4 bg-surface-a1 rounded-lg"
          >
            <img
              src="/caylebWang.jpg"
              alt="Cayleb Wang"
              className="w-full h-56 object-cover rounded-lg mb-2"
            />
            <span className="text-lg sm:text-xl font-bold">Caleb Wang</span>
            <span className="sm:text-lg">Rat Hacks Organizer</span>
          </a>
          <a
            href="https://elipeters.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-4 bg-surface-a1 rounded-lg"
          >
            <img
              src="/eliPeters.jpg"
              alt="Eli Peters"
              className="w-full h-56 object-cover rounded-lg mb-2"
            />
            <span className="text-lg sm:text-xl font-bold">Eli Peters</span>
            <span className="sm:text-lg">Rat Hacks Organizer</span>
          </a>
          <div className="flex flex-col p-4 bg-surface-a1 rounded-lg">
            <img
              src="/mattoxJalbert.jpg"
              alt="Mattox Jalbert"
              className="w-full h-56 object-cover rounded-lg mb-2"
            />
            <span className="text-lg sm:text-xl font-bold">Mattox Jalbert</span>
            <span className="sm:text-lg">Rat Hacks Organizer</span>
          </div>
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
