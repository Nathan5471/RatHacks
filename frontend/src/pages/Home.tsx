import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const eventDate = new Date("2025-11-22T08:00:00");
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
    <div className="flex flex-col h-screen min-w-screen bg-surface-a0 text-white overflow-y-auto">
      <div className="flex flex-row min-h-15 min-w-screen bg-surface-a1 shadow-lg">
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
      <div className="flex flex-col items-center p-4 w-screen h-full overflow-y-auto">
        <h2 className="text-3xl sm:text-6xl mt-6 text-center font-bold">
          Join us for Rat Hacks 2025!
        </h2>
        <p className="text-lg sm:text-2xl mt-4 text-center w-3/4">
          November 22, 2025 8:00 AM - 8:00 PM
        </p>
        <div className="flex flex-row mt-4 p-4 justify-center w-2/3">
          <div className="flex flex-col bg-surface-a1 rounded-lg w-45 p-4 mx-2">
            <span className="text-3xl sm:text-6xl font-bold text-primary-a0 text-center">
              {timeRemaining?.days || 0}
            </span>
            <span className="text-sm sm:text-3xl text-center">Days</span>
          </div>
          <div className="flex flex-col bg-surface-a1 rounded-lg w-45 p-4 mx-2">
            <span className="text-3xl sm:text-6xl font-bold text-primary-a0 text-center">
              {timeRemaining?.hours || 0}
            </span>
            <span className="text-sm sm:text-3xl text-center">Hours</span>
          </div>
          <div className="flex flex-col bg-surface-a1 rounded-lg w-45 p-4 mx-2">
            <span className="text-3xl sm:text-6xl font-bold text-primary-a0 text-center">
              {timeRemaining?.minutes || 0}
            </span>
            <span className="text-sm sm:text-3xl text-center">Minutes</span>
          </div>
          <div className="flex flex-col bg-surface-a1 rounded-lg w-45 p-4 mx-2">
            <span className="text-3xl sm:text-6xl font-bold text-primary-a0 text-center">
              {timeRemaining?.seconds || 0}
            </span>
            <span className="text-sm sm:text-3xl text-center">Seconds</span>
          </div>
        </div>
        <div className="mt-6 text-left w-11/12 text-lg">
          <h2 className="text-4xl font-bold mb-2" id="about">
            About Rat Hacks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">What is Rat Hacks?</h3>
              <p>
                Rat Hacks is a hackathon hosted by the Roanoke Valley Governor's
                School (RVGS). It will be help November 22, 2025 from 8:00 AM to
                8:00 PM. It will be at RVGS, 2104 Grandin Road SW, Roanoke, VA
                24015.
              </p>
            </div>
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Who can attend?</h3>
              <p>
                Rat Hacks is open to all high school students in grades 9-12.
                You can join by creating an account and registering for the
                event! (
                <Link
                  to="/register"
                  className="text-primary-a0 hover:underline"
                >
                  Register Here
                </Link>
                )
              </p>
            </div>
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Teams</h3>
              <p>
                You can participate as an individual or as part of a team
                (highly reccomended!). Teams can be up to 4 members. If you
                don't have a team, we will have a team formation session at the
                start of the event.
              </p>
            </div>
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Prizes</h3>
              <p>
                There will be prizes for the top 3 projects! First place will
                receive $100 per member, second place will receive $50 per
                member, and third place will receive $20 per member.
              </p>
            </div>
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Food & Drinks</h3>
              <p>
                Food and drinks will be provided for free at Rat Hacks! We will
                have chicken nuggets for lunch and pizza for dinner. There will
                also be snacks and water throughout the event. If you have any
                dietary restrictions, please email{" "}
                <a
                  href="mailto:nathan@rathacks.com"
                  className="text-primary-a0 hover:underline"
                >
                  nathan@rathacks.com
                </a>
                .
              </p>
            </div>
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Judging</h3>
              <p>
                Projects will be judged through the week after Rat Hacks by
                judges from the tech industry. Winners will be announced in a
                virtual awards ceremony on Sunday, November 23 at 7:00 PM. You
                will also receive feedback on your project from the judges.
              </p>
            </div>
          </div>
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
            <div className="flex flex-col p-4 bg-surface-a1 rounded-lg">
              <img
                src="/caylebWang.jpg"
                alt="Cayleb Wang"
                className="w-full h-56 object-cover rounded-lg mb-2"
              />
              <span className="text-lg sm:text-xl font-bold">Cayleb Wang</span>
              <span className="sm:text-lg">Rat Hacks Organizer</span>
            </div>
            <div className="flex flex-col p-4 bg-surface-a1 rounded-lg">
              <img
                src="/eliPeters.jpg"
                alt="Eli Peters"
                className="w-full h-56 object-cover rounded-lg mb-2"
              />
              <span className="text-lg sm:text-xl font-bold">Eli Peters</span>
              <span className="sm:text-lg">Rat Hacks Organizer</span>
            </div>
            <div className="flex flex-col p-4 bg-surface-a1 rounded-lg">
              <img
                src="/mattoxJalbert.jpg"
                alt="Mattox Jalbert"
                className="w-full h-56 object-cover rounded-lg mb-2"
              />
              <span className="text-lg sm:text-xl font-bold">
                Mattox Jalbert
              </span>
              <span className="sm:text-lg">Rat Hacks Organizer</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold mt-6" id="schedule">
            Schedule
          </h2>
          <div className="flex flex-col">
            <div className="flex flex-col bg-surface-a1 rounded-lg p-4 my-2 text-xl sm:text-2xl">
              <p>
                <span className="font-bold">7:50 AM - 8:15 AM</span> - Check In
                (RVGS)
              </p>
              <p className="mt-2">
                <span className="font-bold">8:15 AM - 8:30 AM</span> - Opening
                Ceremony (Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">8:30 AM</span> - Hacking Begins!
                (Classrooms)
              </p>
              <p className="mt-2">
                <span className="font-bold">8:30 AM - 9:00 AM</span> - Team
                Formation Session (optional, Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">10:00 AM</span> - Ping Pong
                Tournament Begins! (Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">12:00 PM - 12:30 PM</span> - Lunch,
                Chicken Nuggets (Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">6:00 PM - 6:30 PM</span> - Dinner,
                Pizza (Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">8:00 PM</span> - Submit Projects and
                Go Home!
              </p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mt-6 mb-4" id="faq">
            FAQ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">What is a hackathon?</h3>
              <p>
                A hackathon is an event where you create a project by coding,
                usually in a team! It can be anything from a website, app, game,
                etc.. using any language you want. The goal is to learn and have
                fun. There is not actually any hacking involved.
              </p>
            </div>
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">
                What do I need to bring?
              </h3>
              <p>
                You should bring a laptop and charger that you can code on. If
                you don't have a laptop, you can borrow one from us that has
                Python installed.
              </p>
            </div>
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">
                I don't know how to code, can I still come?
              </h3>
              <p>
                Of course! Rat Hacks is open to any skill level. We also have
                virtual workshops to teach you how to code before the event. You
                can access these through your Rat Hacks account.
              </p>
            </div>
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">
                Do I need to code in X language?
              </h3>
              <p>Nope! You can code in any language you want.</p>
            </div>
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">
                Is there any cost to attend?
              </h3>
              <p>Nope! Rat Hacks is completely free to attend.</p>
            </div>
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">
                What if I have more questions?
              </h3>
              <p>
                You can email us at{" "}
                <a
                  href="mailto:questions@rathacks.com"
                  className="text-primary-a0 hover:underline"
                >
                  questions@rathacks.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
