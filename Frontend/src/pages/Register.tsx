import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/AuthAPIHandler";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="text-4xl font-bold mb-4">Register</h1>
      <div className="w-80 bg-grayt-200 flex flex-col items-center justify-center p-2">
        <div className="flex flex-row">
          <h3>Email:</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-300 p-2 rounded-md"
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-row">
          <h3>First Name:</h3>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-gray-300 p-2 rounded-md"
            placeholder="Enter your first name"
          />
        </div>
        <div className="flex flex-row">
          <h3>Last Name:</h3>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-gray-300 p-2 rounded-md"
            placeholder="Enter your last name"
          />
        </div>
        <div className="flex flex-row">
          <h3>Password:</h3>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-300 p-2 rounded-md"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex flex-row">
          <h3>Confirm Password:</h3>
          <input
            type="text"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-300 p-2 rounded-md"
            placeholder="Confirm your password"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button onClick={handleRegister} className="bg-gray-400 p-2 rounded-md">
          Register
        </button>
      </div>
    </div>
  );
}
