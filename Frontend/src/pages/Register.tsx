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
      await register({ email, password, firstName, lastName });
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
