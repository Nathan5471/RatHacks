import { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function DeleteAccount() {
  const { closeOverlay } = useOverlay();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const preventEnterSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col w-80">
      <h1 className="text-2xl font-bold text-center">Delete Account</h1>
      <form className="flex flex-col" onKeyDown={preventEnterSubmit}>
        <p className="text-lg mt-2 text-center text-red-500 font-bold">
          Are you sure you want to delete your account? This action is permanent
          and can't be undone.
        </p>
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
            className="p-2 rounded-lg text-lg bg-surface-a1 w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 bg-surface-a1 rounded-lg hover:bg-surface-a2 p-2"
          >
            {showPassword ? (
              <IoEyeOff className="text-xl" />
            ) : (
              <IoEye className="text-xl" />
            )}
          </button>
        </div>
        <div className="flex flex-row w-full mt-2">
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg w-full"
          >
            Delete Account
          </button>
          <button
            type="button"
            className="bg-surface-a1 hover:bg-surface-a2 p-2 rounded-lg ml-2 w-full"
            onClick={closeOverlay}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
