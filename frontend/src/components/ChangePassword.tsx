import { useState } from "react";
import { useOverlay } from "../contexts/OverlayContext";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function ChangePassword() {
  const { closeOverlay } = useOverlay();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  return (
    <div className="flex flex-col w-80">
      <h1 className="text-2xl font-bold text-center">Change Password</h1>
      <form className="flex flex-col">
        <label htmlFor="password" className="text-2xl mt-2">
          Current Password
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
        <label htmlFor="newPassword" className="text-2xl mt-2">
          New Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a1 w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="ml-2 bg-surface-a1 rounded-lg hover:bg-surface-a2 p-2"
          >
            {showNewPassword ? (
              <IoEyeOff className="text-lg" />
            ) : (
              <IoEye className="text-lg" />
            )}
          </button>
        </div>
        <label htmlFor="confirmNewPassword" className="text-2xl mt-2">
          Confirm New Password
        </label>
        <div className="flex flex-row w-full mt-1">
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="p-2 rounded-lg text-lg bg-surface-a1 w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            className="ml-2 bg-surface-a1 rounded-lg hover:bg-surface-a2 p-2"
          >
            {showConfirmNewPassword ? (
              <IoEyeOff className="text-lg" />
            ) : (
              <IoEye className="text-lg" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
