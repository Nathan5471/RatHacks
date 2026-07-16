import { useState } from "react";
import { Link } from "react-router-dom";
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
        <Link
          to={user ? "/app" : "/login"}
          className="text-pretty sm:text-lg lg:text-xl bg-primary-a0 hover:bg-primary-a1 rounded-lg text-center justify-center items-center flex font-bold ml-auto m-4 p-2 w-1/6"
        >
          {user ? "Go to App" : "Login"}
        </Link>
      </div>
      <div className="flex flex-col items-center w-screen h-full overflow-y-auto">
        <h2 className="text-3xl sm:text-5xl mt-6 text-center font-bold mb-4">
          Past Events
        </h2>
        <div className="flex flex-col bg-surface-a1 w-full p-4">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-[#17bd3d]">
              Rat Hacks: CTF 2026
            </span>{" "}
            - May 23, 2026 (10:00 AM - 5:00 PM)
          </h3>
          <p className="text-lg sm:text-xl mb-4">
            Rat Hacks: Capture The Flag 2026 is the first Capture The Flag
            hosted by the Rat Hacks team at the Roanoke Valley Governor's
            School. Everyone had a great time trying to solve all of the
            different challenges!
          </p>
          <div className="flex flex-col md:flex-row items-center mb-4">
            <div className="flex flex-col md:w-3/4">
              <h4 className="text-xl sm:text-2xl font-bold text-[#17bd3d]">
                Organizers
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 items-center mt-2">
                <div className="flex flex-col p-2 bg-[#17bd3d] rounded-lg">
                  <img
                    src="/nathanCloutier.webp"
                    alt="Nathan Cloutier"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Nathan Cloutier</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Director
                  </span>
                </div>
                <div className="flex flex-col p-2 bg-[#17bd3d] rounded-lg">
                  <img
                    src="/bearTyree.webp"
                    alt="Bear Tyree"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Bear Tyree</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </div>
                <a
                  href="https://cayleb247.github.io/personal-website/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#17bd3d] rounded-lg"
                >
                  <img
                    src="/calebWang.webp"
                    alt="Caleb Wang"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Caleb Wang</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </a>
                <a
                  href="https://elipeters.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#17bd3d] rounded-lg"
                >
                  <img
                    src="/eliPeters.webp"
                    alt="Eli Peters"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Eli Peters</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </a>
                <div className="flex flex-col p-2 bg-[#17bd3d] rounded-lg">
                  <img
                    src="/mattoxJalbert.webp"
                    alt="Mattox Jalbert"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Mattox Jalbert</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full h-full md:w-1/4 mt-2 md:mt-0">
              <h4 className="text-2xl font-bold font-dream-planner">Stats</h4>
              <div className="flex w-full h-10 md:h-15 bg-[#17bd3d] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl">
                  <span className="font-bold">5</span> Participants
                </p>
              </div>
              <div className="flex w-full h-10 md:h-15 bg-[#17bd3d] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl">
                  <span className="font-bold">5</span> Categories
                </p>
              </div>
              <div className="flex w-full h-10 md:h-15 bg-[#17bd3d] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl ">
                  <span className="font-bold">28</span> Challenges
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-2xl font-bold text-[#17bd3d]">Sponsors</h4>
            <div className="flex flex-wrap gap-4">
              <a
                className="flex flex-col items-center bg-[#17bd3d] p-2 rounded-lg"
                href="https://www.rvgs.k12.va.us/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1710281903/rvgsk12vaus/drpn8vmnyao4u7eydlxk/RVGSBanner.png"
                  alt="RVGS Logo"
                  className="w-36 h-24 sm:w-42 sm:h-28 md:w-48 md:h-32 object-contain bg-[#f4f4f4] p-1"
                />
                <span className="text-lg sm:text-xl text-white">RVGS</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-[#53BFFF] w-full p-4">
          <h3 className="text-2xl sm:text-4xl font-dream-planner mb-1">
            <span className="font-bold">CAMPFIRE ROANOKE</span> - FEBRUARY 28 -
            MARCH 1, 2026 (12:00 PM - 12:00 PM)
          </h3>
          <div className="flex flex-col md:flex-row items-center mb-4">
            <p className="text-xl sm:text-2xl font-ember-fire md:w-1/2">
              Campfire Roanoke was the first overnight high school game jam in
              Roanoke hosted at the Science Museum of Western Virginia by the
              Rat Hacks team! Participants were allowed to work in groups of up
              to 3 to make a game around the theme "Beneath the Surface". Every
              team was able to submit a game, while eating awesome food from
              Jersey Mikes, Chick-fil-A, Domino's, and Sam's Club! Campfire
              Roanoke started out with an awesome opening ceremony in the eye
              planetarium.
            </p>
            <div className="relative flex flex-col items-center w-full md:w-1/2 md:ml-4 h-64">
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
          <div className="flex flex-col md:flex-row items-center mb-4">
            <div className="flex flex-col md:w-3/4">
              <h4 className="text-2xl font-bold font-dream-planner">
                ORGANIZERS
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 items-center mt-2">
                <div className="flex flex-col p-2 bg-[#FFA23C] rounded-lg">
                  <img
                    src="/nathanCloutier.webp"
                    alt="Nathan Cloutier"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-xl font-bold font-dream-planner">
                    NATHAN CLOUTIER
                  </span>
                  <span className="font-ember-fire text-lg">
                    Lead Organizer
                  </span>
                </div>
                <div className="flex flex-col p-2 bg-[#FFA23C] rounded-lg">
                  <img
                    src="/bearTyree.webp"
                    alt="Bear Tyree"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-xl font-bold font-dream-planner">
                    BEAR TYREE
                  </span>
                  <span className="font-ember-fire text-lg">Organizer</span>
                </div>
                <a
                  href="https://cayleb247.github.io/personal-website/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#FFA23C] rounded-lg"
                >
                  <img
                    src="/calebWang.webp"
                    alt="Caleb Wang"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-xl font-bold font-dream-planner">
                    CALEB WANG
                  </span>
                  <span className="font-ember-fire text-lg">Organizer</span>
                </a>
                <a
                  href="https://elipeters.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#FFA23C] rounded-lg"
                >
                  <img
                    src="/eliPeters.webp"
                    alt="Eli Peters"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-xl font-bold font-dream-planner">
                    ELI PETERS
                  </span>
                  <span className="font-ember-fire text-lg">Organizer</span>
                </a>
                <div className="flex flex-col p-2 bg-[#FFA23C] rounded-lg">
                  <img
                    src="/mattoxJalbert.webp"
                    alt="Mattox Jalbert"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="text-xl font-bold font-dream-planner">
                    MATTOX JALBERT
                  </span>
                  <span className="font-ember-fire text-lg">Organizer</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full h-full md:w-1/4">
              <h4 className="text-2xl font-bold font-dream-planner mt-2 sm:mt-0">
                Stats
              </h4>
              <div className="flex w-full h-10 md:h-15 bg-[#FFA23C] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl font-ember-fire">
                  <span className="font-bold">11</span> Participants
                </p>
              </div>
              <div className="flex w-full h-10 md:h-15 bg-[#FFA23C] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl font-ember-fire">
                  <span className="font-bold">7</span> Games Submitted
                </p>
              </div>
              <div className="flex w-full h-10 md:h-15 bg-[#FFA23C] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl font-ember-fire">
                  "Beneath the Surface"
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-2xl font-bold font-dream-planner">SPONSORS</h4>
            <div className="flex flex-wrap gap-4">
              <a
                className="flex flex-col items-center bg-[#FFA23C] p-2 rounded-lg"
                href="https://hackclub.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://assets.hackclub.com/flag-standalone.png"
                  alt="Hack Club Flag"
                  className="w-36 h-24 sm:w-42 sm:h-28 md:w-48 md:h-32 object-contain"
                />
                <span className="text-lg sm:text-xl font-ember-fire">
                  Hack Club
                </span>
              </a>
              <a
                className="flex flex-col items-center bg-[#FFA23C] p-2 rounded-lg"
                href="https://smwv.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://smwv.org/wp-content/uploads/2021/01/cropped-SMWV-Logo-large.png"
                  alt="Science Museum of Western Virginia Logo"
                  className="w-36 h-24 sm:w-42 sm:h-28 md:w-48 md:h-32 object-contain"
                />
                <span className="text-lg sm:text-xl font-ember-fire">
                  Science Museum of Western Virginia
                </span>
              </a>
              <a
                className="flex flex-col items-center bg-[#FFA23C] p-2 rounded-lg"
                href="https://www.ferrum.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.ferrum.edu/wp-content/themes/ferrum-theme/dist/img/ferrum_college_logo_2C.png"
                  alt="Ferrum College Logo"
                  className="w-36 h-24 sm:w-42 sm:h-28 md:w-48 md:h-32 object-contain"
                />
                <span className="text-lg sm:text-xl font-ember-fire">
                  Ferrum College
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-surface-a1 w-full p-4">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-[#17bd3d]">Rat Hacks 2025</span> -
            November 22, 2025 (8:00 AM - 8:00 PM)
          </h3>
          <div className="flex flex-col md:flex-row items-center mb-4">
            <p className="text-lg sm:text-xl md:w-1/2">
              This is the second hackathon hosted by Rat Hacks at the Roanoke
              Valley Governor's School. Participants worked in groups of up to 4
              to make a coding project in 12 hours around the theme "Something
              to Improve your Life". Team made everyting from to-do lists, while
              another team made an empathy bot. Everyone was able to have a
              great time with the ping pong tournament, Chick-fil-a, and
              Domino's! By the end, every team had submitted a project and
              created something really cool!
            </p>
            <div className="relative flex flex-col items-center w-full md:w-1/2 md:ml-4 h-64">
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
          <div className="flex flex-col md:flex-row items-center mb-4">
            <div className="flex flex-col md:w-3/4">
              <h4 className="text-2xl font-bold text-[#17bd3d]">Organizers</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 items-center mt-2">
                <div className="flex flex-col p-2 bg-[#17bd3d] rounded-lg">
                  <img
                    src="/nathanCloutier.webp"
                    alt="Nathan Cloutier"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Nathan Cloutier</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Director
                  </span>
                </div>
                <div className="flex flex-col p-2 bg-[#17bd3d] rounded-lg">
                  <img
                    src="/bearTyree.webp"
                    alt="Bear Tyree"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Bear Tyree</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </div>
                <a
                  href="https://cayleb247.github.io/personal-website/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#17bd3d] rounded-lg"
                >
                  <img
                    src="/calebWang.webp"
                    alt="Caleb Wang"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Caleb Wang</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </a>
                <a
                  href="https://elipeters.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#17bd3d] rounded-lg"
                >
                  <img
                    src="/eliPeters.webp"
                    alt="Eli Peters"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Eli Peters</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </a>
                <div className="flex flex-col p-2 bg-[#17bd3d] rounded-lg">
                  <img
                    src="/mattoxJalbert.webp"
                    alt="Mattox Jalbert"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Mattox Jalbert</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full h-full md:w-1/4 mt-2 md:mt-0">
              <h4 className="text-2xl font-bold font-dream-planner">Stats</h4>
              <div className="flex w-full h-10 md:h-15 bg-[#17bd3d] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl">
                  <span className="font-bold">17</span> Participants
                </p>
              </div>
              <div className="flex w-full h-10 md:h-15 bg-[#17bd3d] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl">
                  <span className="font-bold">5</span> Projects Submitted
                </p>
              </div>
              <div className="flex w-full h-10 md:h-15 bg-[#17bd3d] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl">"Improve Your Life"</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-2xl font-bold text-[#17bd3d]">Sponsors</h4>
            <div className="flex flex-wrap gap-4">
              <a
                className="flex flex-col items-center bg-[#17bd3d] p-2 rounded-lg"
                href="https://www.rvgs.k12.va.us/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1710281903/rvgsk12vaus/drpn8vmnyao4u7eydlxk/RVGSBanner.png"
                  alt="RVGS Logo"
                  className="w-36 h-24 sm:w-42 sm:h-28 md:w-48 md:h-32 object-contain bg-[#f4f4f4] p-1"
                />
                <span className="text-lg sm:text-xl text-white">RVGS</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-[#f4f4f4] w-full p-4 text-black font-sans">
          <h3 className="text-xl sm:text-3xl mb-1">
            <span className="font-bold text-[#144922]">Rat Hacks</span> - May
            24, 2025 (8:00 AM - 8:00 PM)
          </h3>
          <p className="text-lg sm:text-xl mb-4">
            This was the first Rat Hacks hackathons and it was the first
            hackathon available to high schoolers in the area. Participants
            spent 12 hours at the Roanoke Valley Governor's School working in
            teams of up to 4 to make a coding project. Hackers interpreted the
            theme, "Educational Tools," by making everything from flash card
            apps to scholarship scrapers. This event sparked the tradition of
            hosting a ping pong tournament at all of our events. Everyone was
            fueled by some amazing food from Chick-fil-a and Domino's! By the
            end, every team had submitted a project and created something really
            cool!
          </p>
          <div className="flex flex-col md:flex-row items-center mb-4">
            <div className="flex flex-col md:w-3/4">
              <h4 className="text-2xl font-bold text-[#144922]">Organizers</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 items-center mt-2 text-[#f4f4f4]">
                <div className="flex flex-col p-2 bg-[#144922] rounded-lg">
                  <img
                    src="/nathanCloutier.webp"
                    alt="Nathan Cloutier"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Nathan Cloutier</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Director
                  </span>
                </div>
                <div className="flex flex-col p-2 bg-[#144922] rounded-lg">
                  <img
                    src="/elijahHarl.webp"
                    alt="Elijah Harl"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Elijah Harl</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </div>
                <a
                  href="https://elipeters.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-2 bg-[#144922] rounded-lg"
                >
                  <img
                    src="/eliPeters.webp"
                    alt="Eli Peters"
                    className="w-full h-36 object-cover rounded-lg mb-2"
                  />
                  <span className="md:text-xl font-bold">Eli Peters</span>
                  <span className="text-xs md:text-base">
                    Rat Hacks Organizer
                  </span>
                </a>
              </div>
            </div>
            <div className="flex flex-col w-full h-full md:w-1/4 mt-2 md:mt-0">
              <h4 className="text-2xl font-bold text-[#144922]">Stats</h4>
              <div className="flex w-full h-10 md:h-15 bg-[#144922] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl text-[#f4f4f4]">
                  <span className="font-bold">14</span> Participants
                </p>
              </div>
              <div className="flex w-full h-10 md:h-15 bg-[#144922] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl text-[#f4f4f4]">
                  <span className="font-bold">7</span> Projects Submitted
                </p>
              </div>
              <div className="flex w-full h-10 md:h-15 bg-[#144922] rounded-lg justify-center items-center text-center mx-1 my-1">
                <p className="text-3xl text-[#f4f4f4]">"Educational Tools"</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-2xl font-bold text-[#144922]">Sponsors</h4>
            <div className="flex flex-wrap gap-4">
              <a
                className="flex flex-col items-center bg-[#144922] p-2 rounded-lg"
                href="https://www.rvgs.k12.va.us/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1710281903/rvgsk12vaus/drpn8vmnyao4u7eydlxk/RVGSBanner.png"
                  alt="RVGS Logo"
                  className="w-36 h-24 sm:w-42 sm:h-28 md:w-48 md:h-32 object-contain bg-[#f4f4f4] p-1"
                />
                <span className="text-lg sm:text-xl text-[#f4f4f4]">RVGS</span>
              </a>
            </div>
          </div>
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
