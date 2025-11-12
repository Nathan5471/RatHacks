import { useOverlay } from "../contexts/OverlayContext";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  accountType: string;
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

export default function OrganizerUserView({ user }: { user: User }) {
  const { closeOverlay } = useOverlay();
  const gradeMap = {
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    organizer: "Organizer",
    judge: "Judge",
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
      <button
        className="bg-primary-a0 hover:bg-primary-a1 spooky:bg-spooky-a0 spooky:hover:bg-spooky-a1 font-bold p-2 rounded-lg mt-4"
        onClick={closeOverlay}
      >
        Close
      </button>
    </div>
  );
}
