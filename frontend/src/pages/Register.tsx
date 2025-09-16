import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../utils/AuthAPIHandler";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  type SchoolDivision =
    | "Bedford County"
    | "Botetourt County"
    | "Craig County"
    | "Floyd County"
    | "Franklin County"
    | "Roanoke City"
    | "Roanoke County"
    | "Salem City"
    | "other"
    | "";
  const [schoolDivision, setSchoolDivision] = useState<SchoolDivision>("");
  const [schoolDivisionOther, setSchoolDivisionOther] = useState("");
  const [gradeLevel, setGradeLevel] = useState<
    "nine" | "ten" | "eleven" | "twelve" | ""
  >("");
  const [isGovSchool, setIsGovSchool] = useState<boolean | "">("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        schoolDivision:
          schoolDivision === "other" ? schoolDivisionOther : schoolDivision,
        gradeLevel: gradeLevel as "nine" | "ten" | "eleven" | "twelve",
        isGovSchool: isGovSchool as boolean,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-surface-a0 text-white">
      <form
        className="flex flex-col w-80 bg-surface-a1 p-4 m-4 rounded-lg"
        onSubmit={(e) => handleRegister(e)}
      >
        <h1 className="text-primary-a0 text-4xl font-bold text-center mb-4">
          Register
        </h1>
        <label htmlFor="email" className="text-2xl mt-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-surface-a2 p-2 rounded-lg mt-1"
          placeholder="Enter your email"
          required
        />
        <label htmlFor="firstName" className="text-2xl mt-2">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="lastName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="bg-surface-a2 p-2 rounded-lg mt-1"
          placeholder="Enter your first name"
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
          className="bg-surface-a2 p-2 rounded-lg mt-1"
          placeholder="Enter your last name"
          required
        />
        <label htmlFor="password" className="text-2xl mt-2">
          Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg w-full"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 bg-surface-a2 rounded-lg hover:bg-surface-a3 p-2"
          >
            {showPassword ? (
              <IoEyeOff className="text-xl" />
            ) : (
              <IoEye className="text-xl" />
            )}
          </button>
        </div>
        <label htmlFor="confirmPassword" className="text-2xl mt-2">
          Confirm Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg w-full"
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="ml-2 bg-surface-a2 rounded-lg hover:bg-surface-a3 p-2"
          >
            {showConfirmPassword ? (
              <IoEyeOff className="text-xl" />
            ) : (
              <IoEye className="text-xl" />
            )}
          </button>
        </div>
        <label htmlFor="schoolDivision" className="text-2xl mt-2">
          School Division
        </label>
        <select
          id="schoolDivision"
          name="schoolDivision"
          value={schoolDivision}
          onChange={(e) => setSchoolDivision(e.target.value as SchoolDivision)}
          className="bg-surface-a2 p-2 rounded-lg w-full"
          required
        >
          <option value="" disabled>
            Select your school divsion
          </option>
          <option value="Bedford County">Bedford County</option>
          <option value="Botetourt County">Botetourt County</option>
          <option value="Craig County">Craig County</option>
          <option value="Floyd County">Floyd County</option>
          <option value="Franklin County">Franklin County</option>
          <option value="Roanoke City">Roanoke City</option>
          <option value="Roanoke County">Roanoke County</option>
          <option value="Salem City">Salem City</option>
          <option value="other">Other</option>
        </select>
        {schoolDivision === "other" && (
          <input
            type="text"
            id="schoolDivisionOther"
            name="schoolDivisionOther"
            value={schoolDivisionOther}
            onChange={(e) => setSchoolDivisionOther(e.target.value)}
            className="bg-surface-a2 p-2 rounded-lg mt-1"
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
          onChange={(e) =>
            setGradeLevel(
              e.target.value as "nine" | "ten" | "eleven" | "twelve"
            )
          }
          className="bg-surface-a2 p-2 rounded-lg w-full"
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
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-surface-a2 p-2 rounded-lg mt-4 hover:bg-surface-a3"
        >
          Register
        </button>
        <p className="mt-2 text-center text-gray-200">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-a1 hover:underline">
            Login here.
          </Link>
        </p>
      </form>
    </div>
  );
}
