import express from "express";
import {
  register,
  verifyEmail,
  login,
  logout,
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
    gradeLevel: "9" | "10" | "11" | "12";
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
  if (!["9", "10", "11", "12"].includes(gradeLevel)) {
    return res
      .status(400)
      .json({ message: "Grade level must be 9, 10, 11, or 12" });
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
  verifyEmail(req, res);
});

router.post("/logout", authenticate, logout);

router.get("/current-user", authenticate, (req: any, res: any) => {
  const user = {
    _id: req.user._id,
    email: req.user.email,
    isEmailVerified: req.user.isEmailVerified,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    schoolDivision: req.user.schoolDivision,
    gradeLevel: req.user.gradeLevel,
    isGovSchool: req.user.isGovSchool,
  };
  res.status(200).json(user);
});

export default router;
