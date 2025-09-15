import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import AppNavbar from "../components/AppNavbar";

export default function Settings() {
  const { user } = useAuth();
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

  const handleSaveUserInfo = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Add save logic
  };

  return (
    <div className="w-screen h-screen flex flex-row bg-surface-a0 text-white">
      <div className="w-1/6 h-full">
        <AppNavbar />
      </div>
      <div className="w-5/6 h-full flex flex-col p-4 items-center overflow-y-auto">
        <h1 className="text-4xl font-bold text-center">Settings</h1>
        <form
          className="flex flex-col w-1/2 bg-surface-a1 p-4 m-4 rounded-lg"
          onSubmit={(e) => handleSaveUserInfo(e)}
        >
          <h3 className="text-2xl mb-4 text-center font-bold">
            User Information
          </h3>
          <label htmlFor="firstName" className="text-2xl mt-2">
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
          <label htmlFor="lastName" className="text-2xl mt-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a2 mt-2"
            required
          />
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
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <label htmlFor="isGovSchool" className="text-2xl mt-2">
            Do you attend RVGS?
          </label>
          <div className="flex flex-row w-full mt-1">
            <button
              type="button"
              onClick={() => setIsGovSchool(true)}
              className={`${
                isGovSchool ? "bg-primary-a1" : "bg-surface-a2"
              } p-2 rounded-lg w-1/2 mr-1 ${
                isGovSchool ? "hover:bg-primary-a2" : "hover:bg-surface-a3"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setIsGovSchool(false)}
              className={`${
                isGovSchool === false ? "bg-primary-a1" : "bg-surface-a2"
              } p-2 rounded-lg w-1/2 ${
                isGovSchool === false
                  ? "hover:bg-primary-a2"
                  : "hover:bg-surface-a3"
              }`}
            >
              No
            </button>
          </div>
          <button
            type="submit"
            className="mt-4 p-2 bg-primary-a0 hover:bg-primary-a1 rounded-lg text-xl font-bold"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
