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
          Join us for Rat Hacks: Capture The Flag!
        </h2>
        <p className="text-xl sm:text-3xl mt-4 text-center w-3/4">
          May 23, 2026 10:00 AM - 5:00 PM
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
            About Rat Hacks: CTF
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">What is Rat Hacks: CTF?</h3>
              <p>
                Rat Hacks: Capture The Flag is a cybersecurity event called a capture the flag (CTF). It will be held May 23, 2026 from 10:00 AM to 5:00 PM. It will be at RVGS, 2104 Grandin Road SW, Roanoke, VA 24015.
              </p>
            </div>
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Who can attend?</h3>
              <p>
                Rat Hacks: CTF is open to all high school students in grades 9-12.
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
                (highly reccomended!). Teams can be up to 3 members. If you
                don't have a team, we will have a team formation session at the
                start of the event.
              </p>
            </div>
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Capture The Flag Style</h3>
              <p>
                Rat Hacks: CTF will be a jeopardy style CTF. This means that there will 
                be a variety of challenges in different categories such as web exploitation,
                reverse engineering, cryptography, and more! Each challenge will be worth a
                different amount of points based on difficulty. The team with the most amount
                of points wins!
              </p>
            </div>
            <div className="flex flex-col w-full h-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2">Food & Drinks</h3>
              <p>
                Food and drinks will be provided for FREE at Rat Hacks: CTF! We will be having Chick-fil-a for lunch. Snacks and drinks will be provided throughout the event. If you have any
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
              <h3 className="text-xl font-bold mb-2">Workshops</h3>
              <p>
                There will be a ton of virtual workshops leading up to Rat Hacks: CTF. There will be workshops for every, even complete begineers! The workshops will prepare you to solve the challenges at Rat Hacks. It is highly encoureged that you attend at least one workshop before attending.
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
            <a href="https://cayleb247.github.io/personal-website/" target="_blank" rel="noopener noreferrer" className="flex flex-col p-4 bg-surface-a1 rounded-lg">
              <img
                src="/caylebWang.jpg"
                alt="Cayleb Wang"
                className="w-full h-56 object-cover rounded-lg mb-2"
              />
              <span className="text-lg sm:text-xl font-bold">Cayleb Wang</span>
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
                <span className="font-bold">9:50 AM - 10:15 AM</span> - Check In
                (RVGS)
              </p>
              <p className="mt-2">
                <span className="font-bold">10:15 AM - 10:30 AM</span> - Opening
                Ceremony (Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">10:30 AM</span> - Capture The Flag Begins!
              </p>
              <p className="mt-2">
                <span className="font-bold">10:30 AM - 11:00 AM</span> - Team
                Formation Session (optional, Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">12:00 PM - 12:30 PM</span> - Lunch,
                Chicken Nuggets (Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">12:30 PM</span> - Ping Pong
                Tournament Begins! (Lecture Hall)
              </p>
              <p className="mt-2">
                <span className="font-bold">4:30 PM</span> - Capture The Flag Ends
              </p>
              <p className="mt-2">
                <span className="font-bold">4:45 PM - 5:00 PM</span> - Clsoing Ceremony
              </p>
            </div>
          </div>
          <h2 className="text-4xl font-bold mt-6 mb-4" id="faq">
            FAQ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">What is a capture the flag?</h3>
              <p>
                A capture the flag is a cybersecurity event where participants solve
                cybersecurity challenges to earn points. There will be a variety of
                categories and there will be a variety of difficulties, so everyone
                will be able to solve challenges!
              </p>
            </div>
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">
                What do I need to bring?
              </h3>
              <p>
                You should bring a laptop and charger. It is ideal if you can access the
                terminal, but if you aren't able to, you can use <a href="https://play.picoctf.org/practice" target="_blank" rel="noopener noreferrer" className="text-primary-a0 hover:underline">https://play.picoctf.org/practice</a>.
              </p>
            </div>
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">
                I don't know anything about cybersecurity, can I still come?
              </h3>
              <p>
                Of course! Rat Hacks: CTF is designed for all skill levels. Although, I highly reccomend you to attend a few workshops so you can have the tools to solve the challenges. There will be lots of workshops for beginners.
              </p>
            </div>
            <div className="flex flex-col w-full bg-surface-a1 rounded-lg p-4">
              <h3 className="text-2xl font-bold mb-2">
                What resources can I use to prepare for the event?
              </h3>
              <p>The best resource is to join the workshops. If you want some extra practice, I highly reccomend <a href="https://play.picoctf.org/practice" target="_blank" rel="noopener noreferrer" className="text-primary-a0 hover:underline">https://play.picoctf.org/practice</a>, it has a lot of great challenges!</p>
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
