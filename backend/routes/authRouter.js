import express from "express";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    homeSchool,
    otherHomeSchool,
    isGovSchool,
  } = req.body;
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !homeSchool ||
    isGovSchool === undefined
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // TODO: Implement signup logic
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  // TODO: Implement login logic
});

router.post("/logout", async (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/refresh", async (req, res) => {
  // TODO: Implement token refresh logic
});

router.get("/me", async (req, res) => {
  // TODO: Implement get self logic
});
