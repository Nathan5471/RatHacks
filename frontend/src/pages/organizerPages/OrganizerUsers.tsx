import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { useOverlay } from "../../contexts/OverlayContext";
import { getAllUsers } from "../../utils/AuthAPIHandler";
import OrganizerNavbar from "../../components/OrganizerNavbar";
import OrganizerUserView from "../../components/OrganizerUserView";

export default function OrganizerUsers() {
  const { openOverlay } = useOverlay();
  interface User {
    id: string;
    email: string;
    emailVerified: boolean;
    accountType: "student" | "organizer" | "judge";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setDisplayedUsers(filteredUsers);
  }, [
    searchTerm,
    gradeLevelFilter,
    attendsGovSchoolFilter,
    previousHackathonFilter,
    users,
  ]);

  const handleOpenOrganizerUserView = (e: React.MouseEvent, user: User) => {
    e.preventDefault();
    openOverlay(<OrganizerUserView user={user} />);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <OrganizerNavbar />
        </div>
        <div className="w-5/6 h-full flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
        <div className="w-1/6 h-full">
          <OrganizerNavbar />
        </div>
        <div className="w-5/6 h-full flex flex-col items-center">
          <h1 className="text-4xl font-bold mt-2">Users</h1>
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col bg-surface-a1 mx-16 my-6 p-4 rounded-lg">
              <h2 className="text-4xl text-center">
                An error occurred while fetching users:
              </h2>
              <p className="text-2xl text-red-500 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <OrganizerNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col items-center overflow-y-auto">
        <div className="w-5/6 mt-2 h-full flex flex-col mb-2">
          <h1 className="text-4xl font-bold text-center mt-2">
            Users ({displayedUsers.length})
          </h1>
          <div className="flex flex-col mt-4 bg-surface-a1 p-4 rounded-lg items-center">
            <div className="flex flex-row mb-4 w-full justify-between">
              <input
                type="text"
                id="search"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, school division, or tech stack"
                className="w-2/5 p-2 rounded-lg bg-surface-a2"
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
                className="p-2 rounded-lg bg-surface-a2"
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
                className="p-2 rounded-lg bg-surface-a2"
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
                className="p-2 rounded-lg bg-surface-a2"
              >
                <option value="all">Previous Hackathon: All</option>
                <option value="yes">Previous Hackathon: Yes</option>
                <option value="no">Previous Hackathon: No</option>
              </select>
            </div>
            {displayedUsers.length > 0 ? (
              <table className="w-full bg-surface-a2 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                      Name
                    </th>
                    <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                      Email
                    </th>
                    <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                      School Division
                    </th>
                    <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
                      Grade Level
                    </th>
                    <th className="py-2 px-4 border-b border-r border-surface-a1 text-left">
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
                        className={`py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        {user.email}
                      </td>
                      <td
                        className={`py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        {user.schoolDivision}
                      </td>
                      <td
                        className={`py-2 px-4 border-b border-r border-surface-a1 ${
                          index % 2 === 0 ? "bg-surface-a3" : ""
                        }`}
                      >
                        {gradeMap[user.gradeLevel]}
                      </td>
                      <td
                        className={`py-2 px-4 border-b border-r border-surface-a1 ${
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
