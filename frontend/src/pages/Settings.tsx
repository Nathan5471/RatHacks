import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useOverlay } from "../contexts/OverlayContext";
import { updateUser, logoutUser } from "../utils/AuthAPIHandler";
import { IoMenu } from "react-icons/io5";
import AppNavbar from "../components/AppNavbar";
import LogoutAllDevices from "../components/LogoutAllDevices";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openOverlay } = useOverlay();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
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
  const [schoolDivision, setSchoolDivision] = useState(
    user?.schoolDivision !== undefined &&
      schoolDivisions.includes(user?.schoolDivision)
      ? user?.schoolDivision
      : "other"
  );
  const [schoolDivisionOther, setSchoolDivisionOther] = useState(
    user?.schoolDivision !== undefined &&
      !schoolDivisions.includes(user?.schoolDivision)
      ? user?.schoolDivision
      : ""
  );
  const [gradeLevel, setGradeLevel] = useState(user?.gradeLevel || "");
  const [isGovSchool, setIsGovSchool] = useState(user?.isGovSchool || false);
  const [techStack, setTechStack] = useState(user?.techStack || "");
  const [previousHackathon, setPreviousHackathon] = useState(
    user?.previousHackathon || false
  );
  const [parentFirstName, setParentFirstName] = useState(
    user?.parentFirstName || ""
  );
  const [parentLastName, setParentLastName] = useState(
    user?.parentLastName || ""
  );
  const [parentEmail, setParentEmail] = useState(user?.parentEmail || "");
  const [parentPhoneNumber, setParentPhoneNumber] = useState(
    user?.parentPhoneNumber || ""
  );
  const [contactFirstName, setContactFirstName] = useState(
    user?.contactFirstName || ""
  );
  const [contactLastName, setContactLastName] = useState(
    user?.contactLastName || ""
  );
  const [contactRelationship, setContactRelationship] = useState(
    user?.contactRelationship || ""
  );
  const [contactPhoneNumber, setContactPhoneNumber] = useState(
    user?.contactPhoneNumber || ""
  );
  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleSaveUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSchoolDivision =
      schoolDivision === "other" ? schoolDivisionOther : schoolDivision;
    try {
      await updateUser({
        firstName,
        lastName,
        schoolDivision: finalSchoolDivision,
        gradeLevel: gradeLevel as "nine" | "ten" | "eleven" | "twelve",
        isGovSchool,
        techStack,
        previousHackathon,
        parentFirstName,
        parentLastName,
        parentEmail,
        parentPhoneNumber,
        contactFirstName,
        contactLastName,
        contactRelationship,
        contactPhoneNumber,
      });
      toast.success("User information updated successfully!");
    } catch (error) {
      console.error("Failed to update user info:", error);
      toast.error("Failed to update user information.");
    }
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await logoutUser();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
    logout();
    navigate("/");
  };

  const handleOpenLogoutAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openOverlay(<LogoutAllDevices />);
  };

  const handleOpenChangePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openOverlay(<ChangePassword />);
  };

  const handleOpenDeleteAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openOverlay(<DeleteAccount />);
  };

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
          <AppNavbar />
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
        <h1 className="text-3xl sm:text-4xl font-bold text-center">Settings</h1>
        <form
          className="flex flex-col w-full sm:w-1/2 bg-surface-a1 p-4 m-4 rounded-lg"
          onSubmit={(e) => handleSaveUserInfo(e)}
        >
          <h3 className="text-2xl mb-2 text-center font-bold">
            User Information
          </h3>
          <div className="flex flex-row w-full">
            <div className="flex flex-col w-1/2">
              <label htmlFor="firstName" className="text-2xl">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="p-2 rounded-lg text-lg bg-surface-a2 mt-1"
                required
              />
            </div>
            <div className="flex flex-col w-1/2 ml-2">
              <label htmlFor="lastName" className="text-2xl">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="p-2 rounded-lg text-lg bg-surface-a2 mt-1"
                required
              />
            </div>
          </div>
          <label htmlFor="schoolDivision" className="text-2xl mt-1">
            School Division
          </label>
          <select
            id="schoolDivision"
            name="schoolDivision"
            value={schoolDivision}
            onChange={(e) => setSchoolDivision(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 mt-1"
            required
          >
            <option value="" disabled>
              Select your school division
            </option>
            {schoolDivisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {schoolDivision === "other" && (
            <input
              type="text"
              id="schoolDivisionOther"
              name="schoolDivisionOther"
              value={schoolDivisionOther}
              onChange={(e) => setSchoolDivisionOther(e.target.value)}
              className="p-2 rounded-lg text-lg bg-surface-a2 mt-1"
              placeholder="Enter your school division"
              required
            />
          )}
          <label htmlFor="gradeLevel" className="text-2xl mt-2">
            Grade Level
          </label>
          <select
            id="gradeLevel"
            name="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 mt-1"
            required
          >
            <option value="" disabled>
              Select your grade level
            </option>
            <option value="nine">9</option>
            <option value="ten">10</option>
            <option value="eleven">11</option>
            <option value="twelve">12</option>
          </select>
          <label htmlFor="isGovSchool" className="text-2xl mt-2">
            Do you attend RVGS?
          </label>
          <div className="flex flex-row w-full mt-1">
            <button
              type="button"
              onClick={() => setIsGovSchool(true)}
              className={`${
                isGovSchool
                  ? "bg-primary-a1 hover:bg-primary-a2"
                  : "bg-surface-a2 hover:bg-surface-3"
              } p-2 rounded-lg w-1/2 mr-1`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setIsGovSchool(false)}
              className={`${
                isGovSchool === false
                  ? "bg-primary-a1 hover:bg-primary-a2"
                  : "bg-surface-a2 hover:bg-surface-a3"
              } p-2 rounded-lg w-1/2`}
            >
              No
            </button>
          </div>
          <label htmlFor="techStack" className="text-2xl mt-2">
            What coding languages/technologies do you know/use?
          </label>
          <input
            type="text"
            id="techStack"
            name="techStack"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 mt-1"
            placeholder="e.g. Python, JavaScript, React, etc."
            required
          />
          <label htmlFor="previousHackathon" className="text-2xl mt-2">
            Have you attended a hackathon before?
          </label>
          <div className="flex flex-row w-full mt-1">
            <button
              type="button"
              onClick={() => setPreviousHackathon(true)}
              className={`${
                previousHackathon === true
                  ? "bg-primary-a1 hover:bg-primary-a2"
                  : "bg-surface-a2 hover:bg-surface-a3"
              } p-2 rounded-lg w-1/2 mr-1`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setPreviousHackathon(false)}
              className={`${
                previousHackathon === false
                  ? "bg-primary-a1 hover:bg-primary-a2"
                  : "bg-surface-a2 hover:bg-surface-a3"
              } p-2 rounded-lg w-1/2`}
            >
              No
            </button>
          </div>
          <p className="text-2xl text-center mt-4 font-bold">
            Parent/Guardian's Information
          </p>
          <div className="flex flex-row w-full mt-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="parentFirstName" className="text-2xl mt-2">
                First Name
              </label>
              <input
                type="text"
                id="parentFirstName"
                name="parentFirstName"
                value={parentFirstName}
                onChange={(e) => setParentFirstName(e.target.value)}
                className="bg-surface-a2 p-2 rounded-lg mt-1"
                required
              />
            </div>
            <div className="flex flex-col w-1/2 ml-2">
              <label htmlFor="parentLastName" className="text-2xl mt-2">
                Last Name
              </label>
              <input
                type="text"
                id="parentLastName"
                name="parentLastName"
                value={parentLastName}
                onChange={(e) => setParentLastName(e.target.value)}
                className="bg-surface-a2 p-2 rounded-lg mt-1"
                required
              />
            </div>
          </div>
          <label htmlFor="parentEmail" className="text-2xl mt-2">
            Email
          </label>
          <input
            type="email"
            id="parentEmail"
            name="parentEmail"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg mt-1"
            required
          />
          <label htmlFor="parentPhoneNumber" className="text-2xl mt-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="parentPhoneNumber"
            name="parentPhoneNumber"
            value={parentPhoneNumber}
            onChange={(e) => setParentPhoneNumber(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg mt-1"
            required
          />
          <p className="text-2xl text-center mt-4 font-bold">
            Emergency Contact Information
          </p>
          <div className="flex flex-row w-full mt-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="contactFirstName" className="text-2xl mt-2">
                First Name
              </label>
              <input
                type="text"
                id="contactFirstName"
                name="contactFirstName"
                value={contactFirstName}
                onChange={(e) => setContactFirstName(e.target.value)}
                className="bg-surface-a2 p-2 rounded-lg mt-1"
                required
              />
            </div>
            <div className="flex flex-col w-1/2 ml-2">
              <label htmlFor="contactLastName" className="text-2xl mt-2">
                Last Name
              </label>
              <input
                type="text"
                id="contactLastName"
                name="contactLastName"
                value={contactLastName}
                onChange={(e) => setContactLastName(e.target.value)}
                className="bg-surface-a2 p-2 rounded-lg mt-1"
                required
              />
            </div>
          </div>
          <label htmlFor="contactRelationship" className="text-2xl mt-2">
            Relationship
          </label>
          <input
            type="text"
            id="contactRelationship"
            name="contactRelationship"
            value={contactRelationship}
            onChange={(e) => setContactRelationship(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg mt-1"
            required
          />
          <label htmlFor="contactPhoneNumber" className="text-2xl mt-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="contactPhoneNumber"
            name="contactPhoneNumber"
            value={contactPhoneNumber}
            onChange={(e) => setContactPhoneNumber(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg mt-1"
            required
          />
          <button
            type="submit"
            className="mt-4 p-2 bg-primary-a0 hover:bg-primary-a1 rounded-lg text-xl font-bold"
          >
            Save Changes
          </button>
        </form>
        <div className="flex flex-col w-full sm:w-1/2 bg-surface-a1 p-4 m-4 rounded-lg">
          <h3 className="text-2xl mb-4 text-center font-bold text-red-500">
            Danger Zone
          </h3>
          <button
            className="p-2 rounded-lg text-lg bg-red-500 hover:bg-red-600 mt-1"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="p-2 rounded-lg text-lg bg-red-500 hover:bg-red-600 mt-1"
            onClick={handleOpenLogoutAll}
          >
            Logout All Devices
          </button>
          <button
            className="p-2 rounded-lg text-lg bg-red-500 hover:bg-red-600 mt-1"
            onClick={handleOpenChangePassword}
          >
            Change Password
          </button>
          <button
            className="p-2 rounded-lg text-lg bg-red-500 hover:bg-red-600 mt-1"
            onClick={handleOpenDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="dark"
        pauseOnHover={false}
      />
    </div>
  );
}
