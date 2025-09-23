import bcrypt from "bcrypt";
import prisma from "../prisma/client";
import { User } from "@prisma/client";
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
    techStack,
    previousHackathon,
    parentFirstName,
    parentLastName,
    parentEmail,
    parentPhoneNumber,
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
  };

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const emailToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  await prisma.user.create({
    data: {
      email,
      emailToken,
      emailVerified: false,
      password: hashedPassword,
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
      events: [],
      validAccessTokens: [],
      validRefreshTokens: [],
    },
  });
  await sendEmailVerificationEmail({ email, token: emailToken, firstName });

  return res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user.id.toString());
  const refreshToken = generateRefreshToken(user.id.toString());
  await prisma.user.update({
    where: { id: user.id },
    data: {
      validAccessTokens: user.validAccessTokens?.concat(token) || [token],
      validRefreshTokens: user.validRefreshTokens?.concat(refreshToken) || [
        refreshToken,
      ],
    },
  });

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

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or token" });
  }
  if (user.emailVerified) {
    return res.status(200).json({ message: "Email already verified" });
  }
  if (user.emailToken !== token) {
    return res.status(400).json({ message: "Invalid email or token" });
  }

  await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
    },
  });
  return res.status(200).json({ message: "Email verified successfully" });
};

export const resendVerificationEmail = async (req: any, res: any) => {
  const user = req.user as User;
  try {
    await sendEmailVerificationEmail({
      email: user.email,
      token: user.emailToken,
      firstName: user.firstName,
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastResendEmailRequest: new Date(),
      },
    });
    return res.status(200).json({ message: "Verification email resent" });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return res
      .status(500)
      .json({ message: "Failed to resend verification email" });
  }
};

export const logout = async (req: any, res: any) => {
  const accessToken = req.cookies.token as string;
  const refreshToken = req.cookies.refreshToken as string;
  const user = req.user as User;
  if (user && refreshToken) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        validAccessTokens: user.validAccessTokens?.filter(
          (token: string) => token !== accessToken
        ),
        validRefreshTokens: user.validRefreshTokens?.filter(
          (token: string) => token !== refreshToken
        ),
      },
    });
  }
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logout successful" });
};

export const logoutAll = async (req: any, res: any) => {
  const user = req.user as User;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      validAccessTokens: [],
      validRefreshTokens: [],
    },
  });
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out from all devices" });
};

export const updateUser = async (req: any, res: any) => {
  const user = req.user as User;
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
  };
  await prisma.user.update({
    where: { id: user.id },
    data: {
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
    },
  });
  return res.status(200).json({ message: "User updated successfully" });
};

export const updatePassword = async (req: any, res: any) => {
  const user = req.user as User;
  const { newPassword } = req.body as {
    newPassword: string;
  };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      validAccessTokens: [],
      validRefreshTokens: [],
    },
  });

  res.status(200).json({ message: "Password updated successfully" });
};

export const deleteUser = async (req: any, res: any) => {
  const user = req.user as User;

  await user.events.forEach(async (eventId) => {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return;
    }
    await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: event.participants.filter((userId) => userId !== user.id),
      },
    });
  });
  await prisma.user.delete({
    where: { id: user.id },
  });
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "User deleted successfully" });
};
