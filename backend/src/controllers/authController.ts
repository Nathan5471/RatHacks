import bcrypt from "bcrypt";
import User from "../models/user";
import generateToken from "../utils/generateToken";
import sendEmailVerificationEmail from "../utils/sendEmailVerificationEmail";

export const register = async (req: any, res: any) => {
  const { email, password, firstName, lastName } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const emailToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const newUser = new User({
    email,
    emailToken,
    emailVerified: false,
    password: hashedPassword,
    firstName,
    lastName,
  });

  await sendEmailVerificationEmail({ email, token: emailToken, firstName });

  await newUser.save();
  return res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return res.status(200).json({ message: "Login successful" });
};

export const verifyEmail = async (req: any, res: any) => {
  const { email, token } = req.query as { email: string; token: string };

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or token" });
  }
  if (user.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }
  if (user.emailToken !== token) {
    return res.status(400).json({ message: "Invalid email or token" });
  }

  user.emailVerified = true;
  await user.save();
  return res.status(200).json({ message: "Email verified successfully" });
};
