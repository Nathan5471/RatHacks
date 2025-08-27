import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character (!@#$%^&*)",
    });
  }

  // TODO: Implement register function
});

router.post("/login", (req, res) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // TODO: Implement login function
});

export default router;
