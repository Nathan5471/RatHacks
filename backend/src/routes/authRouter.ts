import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  setNewPassword,
  inviteOrganizer,
  registerOrganizer,
  inviteJudge,
  registerJudge,
  cancelInvite,
  logout,
  logoutAll,
  checkResetPassword,
  checkInvite,
  getInvites,
  getAllUsers,
  updateUser,
  updatePassword,
  updateTheme,
  deleteUser,
} from "../controllers/authController";
import authenticate from "../middleware/authenticate";
import { User } from "@prisma/client";

const router = express.Router();

router.post("/register", async (req: any, res: any) => {
  const {
    email,
    password,
    firstName,
    lastName,
    schoolDivision,
    gradeLevel,
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
  } = req.body as {
    email: string;
    password: string;
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
  };

  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !schoolDivision ||
    !gradeLevel ||
    isGovSchool === undefined ||
    !techStack ||
    previousHackathon === undefined ||
    !parentFirstName ||
    !parentLastName ||
    !parentEmail ||
    !parentPhoneNumber ||
    !contactFirstName ||
    !contactLastName ||
    !contactRelationship ||
    !contactPhoneNumber
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)",
    });
  }
  if (!["nine", "ten", "eleven", "twelve"].includes(gradeLevel)) {
    return res
      .status(400)
      .json({ message: "Grade level must be nine, ten, eleven, or twelve" });
  }
  await register(req, res);
});

router.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  await login(req, res);
});

router.post("/verify-email", async (req: any, res: any) => {
  const { email, token } = req.query as { email: string; token: string };

  if (!email || !token) {
    return res.status(400).json({ message: "Email and token are required" });
  }
  await verifyEmail(req, res);
});

router.post(
  "/resend-verification",
  authenticate,
  async (req: any, res: any) => {
    if (req.user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }
    const now = new Date();
    if (
      req.user.lastResendEmailRequest &&
      now.getTime() - req.user.lastResendEmailRequest.getTime() < 15 * 60 * 1000
    ) {
      return res.status(429).json({
        message:
          "You can only request a new verification email every 15 minutes",
      });
    }
    await resendVerificationEmail(req, res);
  }
);

router.post("/reset-password", async (req: any, res: any) => {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  await resetPassword(req, res);
});

router.post("/set-new-password", async (req: any, res: any) => {
  const { email, token, newPassword } = req.body as {
    email: string;
    token: string;
    newPassword: string;
  };

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (
    newPassword.length < 8 ||
    !/[a-z]/.test(newPassword) ||
    !/[A-Z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword) ||
    !/[!@#$%^&*]/.test(newPassword)
  ) {
    return res.status(400).json({
      message:
        "New password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)",
    });
  }

  await setNewPassword(req, res);
});

router.post(
  "/invite/organizer/:email",
  authenticate,
  async (req: any, res: any) => {
    const { email } = req.params as { email: string };

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await inviteOrganizer(req, res);
  }
);

router.post("/organizer/register", async (req: any, res: any) => {
  const { email, password, firstName, lastName, token } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
  };

  if (!email || !password || !firstName || !lastName || !token) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)",
    });
  }

  await registerOrganizer(req, res);
});

router.post(
  "/invite/judge/:email",
  authenticate,
  async (req: any, res: any) => {
    const { email } = req.params as { email: string };

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await inviteJudge(req, res);
  }
);

router.post("/judge/register", async (req: any, res: any) => {
  const { email, password, firstName, lastName, token } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
  };

  if (!email || !password || !firstName || !lastName || !token) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (
    password.length < 8 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)",
    });
  }

  await registerJudge(req, res);
});

router.post("/cancel-invite", authenticate, async (req: any, res: any) => {
  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  await cancelInvite(req, res);
});

router.post("/logout", authenticate, logout);

router.post("/logout-all", authenticate, logoutAll);

router.get("/check/reset-password", async (req: any, res: any) => {
  const { email, token } = req.query as { email: string; token: string };

  if (!email || !token) {
    return res.status(400).json({ message: "Email and token are required" });
  }

  await checkResetPassword(req, res);
});

router.get("/check/invite/organizer", async (req: any, res: any) => {
  const { email, token } = req.query as { email: string; token: string };

  if (!email || !token) {
    return res.status(400).json({ message: "Email and token are required" });
  }

  req.type = "organizer";

  await checkInvite(req, res);
});

router.get("/check/invite/judge", async (req: any, res: any) => {
  const { email, token } = req.query as { email: string; token: string };

  if (!email || !token) {
    return res.status(400).json({ message: "Email and token are required" });
  }

  req.type = "judge";

  await checkInvite(req, res);
});

router.get("/invites", authenticate, getInvites);

router.get("/current-user", authenticate, (req: any, res: any) => {
  const reqUser = req.user as User;
  const user = {
    id: reqUser.id,
    email: reqUser.email,
    emailVerified: reqUser.emailVerified,
    accountType: reqUser.accountType,
    firstName: reqUser.firstName,
    lastName: reqUser.lastName,
    schoolDivision: reqUser.schoolDivision,
    gradeLevel: reqUser.gradeLevel,
    isGovSchool: reqUser.isGovSchool,
    techStack: reqUser.techStack,
    previousHackathon: reqUser.previousHackathon,
    parentFirstName: reqUser.parentFirstName,
    parentLastName: reqUser.parentLastName,
    parentEmail: reqUser.parentEmail,
    parentPhoneNumber: reqUser.parentPhoneNumber,
    contactFirstName: reqUser.contactFirstName,
    contactLastName: reqUser.contactLastName,
    contactRelationship: reqUser.contactRelationship,
    contactPhoneNumber: reqUser.contactPhoneNumber,
    events: reqUser.events,
    workshops: reqUser.workshops,
    theme: reqUser.theme,
  };
  res.status(200).json(user);
});

router.get("/all", authenticate, getAllUsers);

router.put("/update", authenticate, async (req: any, res: any) => {
  const {
    firstName,
    lastName,
    schoolDivision,
    gradeLevel,
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
  } = req.body as {
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
  };
  if (
    !firstName ||
    !lastName ||
    !schoolDivision ||
    !gradeLevel ||
    isGovSchool === undefined ||
    !techStack ||
    previousHackathon === undefined ||
    !parentFirstName ||
    !parentLastName ||
    !parentEmail ||
    !parentPhoneNumber ||
    !contactFirstName ||
    !contactLastName ||
    !contactRelationship ||
    !contactPhoneNumber
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!["nine", "ten", "eleven", "twelve"].includes(gradeLevel)) {
    return res
      .status(400)
      .json({ message: "Grade level must be nine, ten, eleven, or twelve" });
  }
  await updateUser(req, res);
});

router.put("/update-password", authenticate, async (req: any, res: any) => {
  const { newPassword } = req.body as {
    newPassword: string;
  };

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }
  if (
    newPassword.length < 8 ||
    !/[a-z]/.test(newPassword) ||
    !/[A-Z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword) ||
    !/[!@#$%^&*]/.test(newPassword)
  ) {
    return res.status(400).json({
      message:
        "New password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)",
    });
  }

  await updatePassword(req, res);
});

router.put("/update-theme", authenticate, async (req: any, res: any) => {
  const { theme } = req.body as { theme: string };
  const themeOptions = ["default", "spooky", "space", "framework"];
  if (!themeOptions.includes(theme)) {
    return res.status(400).json({ message: "Invalid theme option" });
  }

  await updateTheme(req, res);
});

router.delete("/delete", authenticate, deleteUser);

export default router;
