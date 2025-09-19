import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  logout,
  logoutAll,
  updateUser,
  updatePassword,
  deleteUser,
} from "../controllers/authController";
import authenticate from "../middleware/authenticate";

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
  } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    schoolDivision: string;
    gradeLevel: "nine" | "ten" | "eleven" | "twelve";
    isGovSchool: boolean;
  };

  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !schoolDivision ||
    !gradeLevel ||
    isGovSchool === undefined
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

router.post("/logout", authenticate, logout);

router.post("/logout-all", authenticate, logoutAll);

router.get("/current-user", authenticate, (req: any, res: any) => {
  const user = {
    id: req.user.id,
    email: req.user.email,
    emailVerified: req.user.emailVerified,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    schoolDivision: req.user.schoolDivision,
    gradeLevel: req.user.gradeLevel,
    isGovSchool: req.user.isGovSchool,
  };
  res.status(200).json(user);
});

router.put("/update", authenticate, async (req: any, res: any) => {
  const { firstName, lastName, schoolDivision, gradeLevel, isGovSchool } =
    req.body as {
      firstName: string;
      lastName: string;
      schoolDivision: string;
      gradeLevel: "nine" | "ten" | "eleven" | "twelve";
      isGovSchool: boolean;
    };
  if (
    !firstName ||
    !lastName ||
    !schoolDivision ||
    !gradeLevel ||
    isGovSchool === undefined
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

router.delete("/delete", authenticate, deleteUser);

export default router;
