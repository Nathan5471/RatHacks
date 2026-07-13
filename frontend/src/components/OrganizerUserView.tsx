import { useOverlay } from "../contexts/OverlayContext";
import OrganizerChangeAccountType from "../components/OrganizerChangeAccountType";
import OrganizerDeleteUser from "../components/OrganizerDeleteUser";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  accountType: "student" | "judge" | "organizer";
  theme?: "default" | "spooky" | "space" | "framework";
  firstName: string;
  lastName: string;
  schoolDivision: string;
  gradeLevel: "nine" | "ten" | "eleven" | "twelve" | "organizer" | "judge";
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
  checkedIn?: boolean;
  createdAt: string;
}

export default function OrganizerUserView({
  user,
  setRefreshData,
}: {
  user: User;
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { closeOverlay, openOverlay } = useOverlay();
  const gradeMap = {
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    organizer: "Organizer",
    judge: "Judge",
  };

  const openChangeAccountTypeOverlay = () => {
    openOverlay(
      <OrganizerChangeAccountType
        id={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        currentAccountType={user.accountType}
        setRefreshData={setRefreshData}
      />,
    );
  };

  const openDeleteUserOverlay = () => {
    openOverlay(
      <OrganizerDeleteUser
        id={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        setRefreshData={setRefreshData}
      />,
    );
  };

  return (
    <div className="flex flex-col w-80 sm:w-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
        {user.firstName} {user.lastName}
      </h1>
      <p className="text-lg sm:text-xl text-left">Email: {user.email}</p>
      <p className="text-lg sm:text-xl text-left">
        Email Verified: {user.emailVerified ? "Yes" : "No"}
      </p>
      <p className="text-lg sml:text-xl text-left">
        Account Type: {user.accountType}
      </p>
      {user.theme && (
        <p className="text-lg sm:text-xl text-left">
          Theme: {user.theme.charAt(0).toUpperCase() + user.theme.slice(1)}
        </p>
      )}
      <p className="text-lg sm:text-xl text-left">
        School Division: {user.schoolDivision}
      </p>
      <p className="text-lg sm:text-xl text-left">
        Grade Level: {gradeMap[user.gradeLevel]}
      </p>
      <p className="text-lg sm:text-xl text-left">
        Attends RVGS: {user.isGovSchool ? "Yes" : "No"}
      </p>
      <p className="text-lg sm:text-xl text-left">
        Tech Stack: {user.techStack}
      </p>
      <p className="text-lg sm:text-xl text-left">
        Previous Hackathon: {user.previousHackathon ? "Yes" : "No"}
      </p>
      <p className="text-lg sm:text-xl text-left">
        Parent's Name: {user.parentFirstName} {user.parentLastName}
      </p>
      <p className="text-lg sm:text-xl text-left">
        Parent's Email: {user.parentEmail}
      </p>
      <p className="text-lg sm:text-xl text-left">
        Parent's Phone Number: {user.parentPhoneNumber}
      </p>
      <p className="text-lg sm:text-xl text-left">
        Emergency Contact: {user.contactFirstName} {user.contactLastName} (
        {user.contactRelationship})
      </p>
      <p className="text-lg sm:text-xl text-left">
        Contact's Phone Number: {user.contactPhoneNumber}
      </p>
      {user.checkedIn !== undefined && (
        <p className="text-lg sm:text-xl text-left">
          Checked In: {user.checkedIn ? "Yes" : "No"}
        </p>
      )}
      <p className="text-lg sm:text-xl text-left">
        Account Created: {new Date(user.createdAt).toLocaleString()}
      </p>
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <button
          className="bg-primary-a0 hover:bg-primary-a1 font-bold p-2 rounded-lg mt-4 w-full sm:w-1/2"
          onClick={openChangeAccountTypeOverlay}
        >
          Change Account Type
        </button>
        <button
          className="bg-red-500 hover:bg-red-400 font-bold p-2 rounded-lg mt-4 w-full sm:w-1/2"
          onClick={openDeleteUserOverlay}
        >
          Delete User
        </button>
      </div>
      <button
        className="bg-primary-a0 hover:bg-primary-a1 font-bold p-2 rounded-lg mt-4"
        onClick={closeOverlay}
      >
        Close
      </button>
    </div>
  );
}
