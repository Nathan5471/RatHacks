import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { useOverlay } from "../../contexts/OverlayContext";
import { getAllUsers } from "../../utils/AuthAPIHandler";
import { IoMenu } from "react-icons/io5";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import OrganizerUserView from "../../components/OrganizerUserView";

export default function OrganizerUsers() {
  const { openOverlay } = useOverlay();
  interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    accountType: "student" | "organizer" | "judge";
    theme: "default" | "spooky" | "space" | "framework";
    firstName: string;
    lastName: string;
    schoolDivision: string;
    gradeLevel: "nine" | "ten" | "eleven" | "twelve";
    isGovSchool: boolean;
    techStack: string;
    previousHackathon: boolean;
    parentFirstName: string;
    parentLastName: string;
    parentEmail: string;
    parentPhoneNumber: string;
    contactFirstName: string;
    contactLastName: string;
    contactRelationship: string;
    contactPhoneNumber: string;
    createdAt: string;
  }
  const gradeMap = {
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
  };
  const [users, setUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeLevelFilter, setGradeLevelFilter] = useState<
    "all" | "nine" | "ten" | "eleven" | "twelve"
  >("all");
  const [attendsGovSchoolFilter, setAttendsGovSchoolFilter] = useState<
    "all" | "yes" | "no"
  >("all");
  const [previousHackathonFilter, setPreviousHackathonFilter] = useState<
    "all" | "yes" | "no"
  >("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState<
    "all" | "student" | "organizer" | "judge"
  >("all");
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<
    "all" | "yes" | "no"
  >("all");
  const [schoolDivisionFilter, setSchoolDivisionFilter] =
    useState<string>("all");
  const [themeFilter, setThemeFilter] = useState<
    "all" | "default" | "spooky" | "space" | "framework"
  >("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = (await getAllUsers()) as {
          message: string;
          users: User[];
        };
        setUsers(userData.users);
        setDisplayedUsers(userData.users);
      } catch (error: unknown) {
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filteredUsers = [...users];
    if (searchTerm) {
      const fuse = new Fuse(filteredUsers, {
        keys: ["firstName", "lastName", "email", "schoolDivision", "techStack"],
        threshold: 0.3,
      });
      filteredUsers = fuse.search(searchTerm).map((result) => result.item);
    }
    if (gradeLevelFilter !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.gradeLevel === gradeLevelFilter
      );
    }
    // For these next two, I used === false to not include organizers/judges (they have null values)
    if (attendsGovSchoolFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) =>
        attendsGovSchoolFilter === "yes"
          ? user.isGovSchool
          : user.isGovSchool === false
      );
    }
    if (previousHackathonFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) =>
        previousHackathonFilter === "yes"
          ? user.previousHackathon
          : user.previousHackathon === false
      );
    }
    if (accountTypeFilter !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.accountType === accountTypeFilter
      );
    }
    if (emailVerifiedFilter !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.emailVerified === (emailVerifiedFilter === "yes" ? true : false)
      );
    }
    if (schoolDivisionFilter !== "all") {
      const schoolDivisions = [
        "Bedford County",
        "Botetourt County",
        "Craig County",
        "Floyd County",
        "Franklin County",
        "Roanoke City",
        "Roanoke County",
        "Salem City",
      ];
      if (schoolDivisionFilter === "other") {
        filteredUsers = filteredUsers.filter(
          (user) => !schoolDivisions.includes(user.schoolDivision)
        );
      }
      filteredUsers = filteredUsers.filter(
        (user) => user.schoolDivision === schoolDivisionFilter
      );
    }
    if (themeFilter !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.theme === themeFilter
      );
    }
    setDisplayedUsers(filteredUsers);
  }, [
    searchTerm,
    gradeLevelFilter,
    attendsGovSchoolFilter,
    previousHackathonFilter,
    accountTypeFilter,
    emailVerifiedFilter,
    schoolDivisionFilter,
    themeFilter,
    users,
  ]);

  const handleOpenOrganizerUserView = (e: React.MouseEvent, user: User) => {
    e.preventDefault();
    openOverlay(<OrganizerUserView user={user} />);
  };

  if (loading) {
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
            <OrganizerNavbar />
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
          <p className="text-2xl font-bold">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
            <OrganizerNavbar />
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
          <h1 className="text-2xl sm:text-4xl font-bold">Users</h1>
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col bg-surface-a1 mx-16 my-6 p-4 rounded-lg">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-center">
                An error occurred while fetching users:
              </h2>
              <p className="text-lg sm:text-2xl text-red-500 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <OrganizerNavbar />
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
        <div className="w-full sm:w-5/6 mt-2 h-full flex flex-col mb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-2">
            Users ({displayedUsers.length})
          </h1>
          <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg items-center">
            <div className="flex flex-col lg:flex-row mb-4 w-full justify-between">
              <input
                type="text"
                id="search"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, school division, or tech stack"
                className="w-full lg:w-2/5 p-2 rounded-lg bg-surface-a2"
              />
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={gradeLevelFilter}
                onChange={(e) =>
                  setGradeLevelFilter(
                    e.target.value as
                      | "all"
                      | "nine"
                      | "ten"
                      | "eleven"
                      | "twelve"
                  )
                }
                className="mt-1 lg:mt-0 p-2 rounded-lg bg-surface-a2"
              >
                <option value="all">All Grade Levels</option>
                <option value="nine">9</option>
                <option value="ten">10</option>
                <option value="eleven">11</option>
                <option value="twelve">12</option>
              </select>
              <select
                id="attendsGovSchool"
                name="attendsGovSchool"
                value={attendsGovSchoolFilter}
                onChange={(e) =>
                  setAttendsGovSchoolFilter(
                    e.target.value as "all" | "yes" | "no"
                  )
                }
                className="mt-1 lg:mt-0 p-2 rounded-lg bg-surface-a2"
              >
                <option value="all">Gov School: All</option>
                <option value="yes">Gov School: Yes</option>
                <option value="no">Gov School: No</option>
              </select>
              <select
                id="previousHackathon"
                name="previousHackathon"
                value={previousHackathonFilter}
                onChange={(e) =>
                  setPreviousHackathonFilter(
                    e.target.value as "all" | "yes" | "no"
                  )
                }
                className="mt-1 lg:mt-0 p-2 rounded-lg bg-surface-a2"
              >
                <option value="all">Previous Hackathon: All</option>
                <option value="yes">Previous Hackathon: Yes</option>
                <option value="no">Previous Hackathon: No</option>
              </select>
            </div>
            <div className="flex flex-col lg:flex-row mb-4 w-full justify-between">
              <select
                id="accountType"
                name="accountType"
                value={accountTypeFilter}
                onChange={(e) => {
                  setAccountTypeFilter(
                    e.target.value as "all" | "student" | "organizer" | "judge"
                  );
                }}
                className="mt-1 lg:mt-0 p-2 rounded-lg bg-surface-a2"
              >
                <option value="all">Account Type: All</option>
                <option value="student">Account Type: Student</option>
                <option value="organizer">Account Type: Organizer</option>
                <option value="judge">Account Type: Judge</option>
              </select>
              <select
                id="emailVerified"
                name="emailVerified"
                value={emailVerifiedFilter}
                onChange={(e) =>
                  setEmailVerifiedFilter(e.target.value as "all" | "yes" | "no")
                }
                className="mt-1 lg:mt-0 p-2 rounded-lg bg-surface-a2"
              >
                <option value="all">Email Verified: All</option>
                <option value="yes">Email Verified: Yes</option>
                <option value="no">Email Verified: No</option>
              </select>
              <select
                id="schoolDivision"
                name="schoolDivision"
                value={schoolDivisionFilter}
                onChange={(e) => setSchoolDivisionFilter(e.target.value)}
                className="mt-1 lg:mt-0 p-2 rounded-lg bg-surface-a2"
              >
                <option value="all">School Division: All</option>
                {[
                  "Bedford County",
                  "Botetourt County",
                  "Craig County",
                  "Floyd County",
                  "Franklin County",
                  "Roanoke City",
                  "Roanoke County",
                  "Salem City",
                ].map((division) => (
                  <option key={division} value={division}>
                    School Division: {division}
                  </option>
                ))}
                <option value="other">School Division: Other</option>
              </select>
              <select
                id="theme"
                name="theme"
                value={themeFilter}
                onChange={(e) => {
                  setThemeFilter(
                    e.target.value as
                      | "all"
                      | "default"
                      | "spooky"
                      | "space"
                      | "framework"
                  );
                }}
                className="mt-1 lg:mt-0 p-2 rounded-lg bg-surface-a2"
              >
                <option value="all">Theme: All</option>
                <option value="default">Theme: Default</option>
                <option value="spooky">Theme: Spooky</option>
                <option value="space">Theme: Space</option>
                <option value="framework">Theme: Framework</option>
              </select>
            </div>
            {displayedUsers.length > 0 ? (
              <table className="w-full bg-surface-a2 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                      Name
                    </th>
                    <th className="hidden sm:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                      Email
                    </th>
                    <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                      School Division
                    </th>
                    <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                      Grade Level
                    </th>
                    <th className="hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 text-left">
                      Is RVGS
                    </th>
                    <th className="py-2 px-4 border-b border-r border-surface-a1 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td
                        className={`py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        {user.firstName} {user.lastName}
                      </td>
                      <td
                        className={`hidden sm:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        {user.email}
                      </td>
                      <td
                        className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        {user.schoolDivision}
                      </td>
                      <td
                        className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        {gradeMap[user.gradeLevel]}
                      </td>
                      <td
                        className={`hidden lg:table-cell py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        {user.isGovSchool ? "Yes" : "No"}
                      </td>
                      <td
                        className={`py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        <button
                          className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg font-bold"
                          onClick={(e) => handleOpenOrganizerUserView(e, user)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
