import bcrypt from "bcrypt";
import User from "../models/user";
import generateToken from "../utils/generateToken";
import generateRefreshToken from "../utils/generateRefreshToken";
import sendEmailVerificationEmail from "../utils/sendEmailVerificationEmail";

export const register = async (req: any, res: any) => {
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
    schoolDivision,
    gradeLevel,
    isGovSchool,
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

  const refreshToken = generateRefreshToken(user._id.toString());
  user.validRefreshTokens = user.validRefreshTokens?.concat(refreshToken) || [
    refreshToken,
  ];
  const token = generateToken(user._id.toString());
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 6 * 60 * 60 * 1000, // 6 hours
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
    return res.status(200).json({ message: "Email already verified" });
  }
  if (user.emailToken !== token) {
    return res.status(400).json({ message: "Invalid email or token" });
  }

  user.emailVerified = true;
  await user.save();
  return res.status(200).json({ message: "Email verified successfully" });
};

export const resendVerificationEmail = async (req: any, res: any) => {
  const user = req.user;
  try {
    await sendEmailVerificationEmail({
      email: user.email,
      token: user.emailToken,
      firstName: user.firstName,
    });
    user.lastResendEmailRequest = new Date();
    await user.save();
    return res.status(200).json({ message: "Verification email resent" });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return res
      .status(500)
      .json({ message: "Failed to resend verification email" });
  }
};

export const logout = async (req: any, res: any) => {
  const refreshToken = req.cookies.refreshToken;
  const user = req.user;
  if (user && refreshToken) {
    user.validRefreshTokens = user.validRefreshTokens?.filter(
      (token: string) => token !== refreshToken
    );
    await user.save();
  }
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logout successful" });
};
