import { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from "../contexts/AuthContext";
import { IoArrowForwardCircle, IoArrowBackCircle } from "react-icons/io5";

export default function PastEvents() {
  const { user } = useAuth();
  const campfireRoanokeImageCount = 9;
  const [campfireRoanokeImageIndex, setCampfireRoanokeImageIndex] = useState(1);
  const ratHacks2025ImageCount = 5;
  const [ratHacks2025ImageIndex, setRatHacks2025ImageIndex] = useState(1);

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
        <h2 className="text-2xl sm:text-5xl mt-6 text-center font-bold mb-4">
          Past Events
        </h2>
        <div className="flex flex-col bg-surface-a1 w-full p-4">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-primary-a0">
              Rat Hacks: CTF 2026
            </span>{" "}
            - May 23, 2026 (10:00 AM - 5:00 PM)
          </h3>
          <p className="sm:text-lg mb-4">Participants: 5</p>
          <p className="text-lg sm:text-xl">
            Rat Hacks: Capture The Flag 2026 is the first Capture The Flag
            hosted by the Rat Hacks team at the Roanoke Valley Governor's
            School. Lunch was the classic Chick-fil-A chicken nuggets! Everyone
            solved tons of challenges and had a great time.
          </p>
        </div>
        <div className="flex flex-col bg-[#53BFFF] w-full p-4">
          <h3 className="text-2xl sm:text-4xl font-dream-planner mb-1">
            <span className="font-bold">CAMPFIRE ROANOKE</span> - FEBRUARY 28 -
            MARCH 1, 2026 (12:00 PM - 12:00 PM)
          </h3>
          <div className="flex flex-col sm:flex-row items-center mb-4">
            <p className="text-xl sm:text-2xl font-ember-fire sm:w-1/2">
              Campfire Roanoke was the first overnight high school game jam in
              Roanoke hosted at the Science Museum of Western Virgiinia by the
              Rat Hacks team! Participants were allowed to work in groups of up
              to 3 to make a game around the theme "Beneath the Surface". Every
              team was able to submit a game, while eating awesome food from
              Jersey Mikes, Chick-fil-A, Domino's, and Sam's Club! The highlight
              from the event was the opening ceremony held in the eye
              planetarium.
            </p>
            <div className="relative flex flex-col items-center sm:w-1/2 sm:ml-4 h-64">
              <img
                src={`/CampfireRoanoke/image${campfireRoanokeImageIndex}.webp`}
                alt="Campfire Roanoke"
                className="w-full h-full object-cover"
              />
              <IoArrowBackCircle
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white cursor-pointer hover:text-gray-300"
                size={40}
                onClick={() =>
                  setCampfireRoanokeImageIndex(
                    campfireRoanokeImageIndex === 1
                      ? campfireRoanokeImageCount
                      : campfireRoanokeImageIndex - 1,
                  )
                }
              />
              <IoArrowForwardCircle
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white cursor-pointer hover:text-gray-300"
                size={40}
                onClick={() =>
                  setCampfireRoanokeImageIndex(
                    campfireRoanokeImageIndex === campfireRoanokeImageCount
                      ? 1
                      : campfireRoanokeImageIndex + 1,
                  )
                }
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="flex flex-col sm:w-3/4">
              <h4 className="text-xl sm:text-2xl font-bold font-dream-planner">
                ORGANIZERS
              </h4>
              <div className="grid grid-cols-5 items-center mt-2">
                <div className="flex flex-col p-2 bg-[#FFA23C] rounded-lg">
                  <img
                    src="/nathanCloutier.jpg"
                    alt="Nathan Cloutier"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-lg sm:text-xl font-bold font-dream-planner">
                    NATHAN CLOUTIER
                  </span>
                  <span className="font-ember-fire">Lead Organizer</span>
                </div>
                <div className="flex flex-col p-2 bg-[#FFA23C] rounded-lg mx-1">
                  <img
                    src="/bearTyree.jpg"
                    alt="Bear Tyree"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-lg sm:text-xl font-bold font-dream-planner">
                    BEAR TYREE
                  </span>
                  <span className="sm:text-lg font-ember-fire">Organizer</span>
                </div>
                <a
                  href="https://cayleb247.github.io/personal-website/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#FFA23C] rounded-lg mx-1"
                >
                  <img
                    src="/caylebWang.jpg"
                    alt="Cayleb Wang"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-lg sm:text-xl font-bold font-dream-planner">
                    CALEB WANG
                  </span>
                  <span className="sm:text-lg font-ember-fire">Organizer</span>
                </a>
                <a
                  href="https://elipeters.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#FFA23C] rounded-lg mx-1"
                >
                  <img
                    src="/eliPeters.jpg"
                    alt="Eli Peters"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-lg sm:text-xl font-bold font-dream-planner">
                    ELI PETERS
                  </span>
                  <span className="sm:text-lg font-ember-fire">Organizer</span>
                </a>
                <div className="flex flex-col p-2 bg-[#FFA23C] rounded-lg mx-1">
                  <img
                    src="/mattoxJalbert.jpg"
                    alt="Mattox Jalbert"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-lg sm:text-xl font-bold font-dream-planner">
                    MATTOX JALBERT
                  </span>
                  <span className="sm:text-lg font-ember-fire">Organizer</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full h-full sm:w-1/4">
              <h4 className="text-xl sm:text-2xl font-bold font-dream-planner">
                Stats
              </h4>
              <div className="flex w-full h-15 bg-[#FFA23C] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-5xl sm:text-3xl font-ember-fire">
                  <span className="font-bold">11</span> Participants
                </p>
              </div>
              <div className="flex w-full h-15 bg-[#FFA23C] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-5xl sm:text-3xl font-ember-fire">
                  <span className="font-bold">7</span> Games Submitted
                </p>
              </div>
              <div className="flex w-full h-15 bg-[#FFA23C] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-5xl sm:text-3xl font-ember-fire">
                  "Beneath the Surface"
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-surface-a1 w-full p-4">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-primary-a0">Rat Hacks 2025</span> -
            November 22, 2025 (8:00 AM - 8:00 PM)
          </h3>
          <div className="flex flex-col sm:flex-row items-center mb-4">
            <p className="text-lg sm:text-xl sm:w-1/2">
              This is the second hackathon hosted by Rat Hacks at the Roanoke
              Valley Governor's School. Participants worked in groups of up to 4
              to make a coding project in 12 hours around the theme "Something
              to Improve your Life". For lunch and dinner, we had Chick-fil-A
              and Domino's. Everyone was able to submit a project.
            </p>
            <div className="relative flex flex-col items-center sm:w-1/2 sm:ml-4 h-64">
              <img
                src={`/RatHacks2025/image${ratHacks2025ImageIndex}.webp`}
                alt="Rat Hacks 2025"
                className="w-full h-full object-cover"
              />
              <IoArrowBackCircle
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white cursor-pointer hover:text-gray-300"
                size={40}
                onClick={() =>
                  setRatHacks2025ImageIndex(
                    ratHacks2025ImageIndex === 1
                      ? ratHacks2025ImageCount
                      : ratHacks2025ImageIndex - 1,
                  )
                }
              />
              <IoArrowForwardCircle
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white cursor-pointer hover:text-gray-300"
                size={40}
                onClick={() =>
                  setRatHacks2025ImageIndex(
                    ratHacks2025ImageIndex === ratHacks2025ImageCount
                      ? 1
                      : ratHacks2025ImageIndex + 1,
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-[#f4f4f4ff] w-full p-4 text-black">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-[#144922ff]">Rat Hacks</span> - May
            24, 2025 (8:00 AM - 8:00 PM)
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
        <div className="flex flex-col items-center p-4 w-screen h-full bg-surface-a1">
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
