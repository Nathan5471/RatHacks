import bcrypt from "bcrypt";
import prisma from "../prisma/client";
import { User } from "@prisma/client";
import generateToken from "../utils/generateToken";
import generateRefreshToken from "../utils/generateRefreshToken";
import sendEmailVerificationEmail from "../utils/sendEmailVerificationEmail";
import sendOrganizerInviteEmail from "../utils/sendOrganizerInviteEmail";
import sendJudgeInviteEmail from "../utils/sendJudgeInviteEmail";

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

  try {
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
        contactFirstName,
        contactLastName,
        contactRelationship,
        contactPhoneNumber,
        events: [],
        validAccessTokens: [],
        validRefreshTokens: [],
      },
    });
    await sendEmailVerificationEmail({ email, token: emailToken, firstName });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  try {
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
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Failed to login user" });
  }
};

export const verifyEmail = async (req: any, res: any) => {
  const { email, token } = req.query as { email: string; token: string };

  try {
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
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Failed to verify email" });
  }
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

export const inviteOrganizer = async (req: any, res: any) => {
  const { email } = req.params as { email: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);
  try {
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const invite = await prisma.invite.create({
      data: {
        email,
        role: "organizer",
        expires: expiration,
      },
    });

    await sendOrganizerInviteEmail({ token: invite.token, email, expiration });
    return res.status(200).json({ message: "Successfully sent invite" });
  } catch (error) {
    console.error("Error inviting organizer:", error);
    return res.status(500).json({ message: "Failed to invite organizer" });
  }
};

export const inviteJudge = async (req: any, res: any) => {
  const { email } = req.params as { email: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);
  try {
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const invite = await prisma.invite.create({
      data: {
        email,
        role: "judge",
        expires: expiration,
      },
    });

    await sendJudgeInviteEmail({ token: invite.token, email, expiration });
    return res.status(200).json({ message: "Successfully sent invitation" });
  } catch (error) {
    console.error("Error inviting judge:", error);
    return res.status(500).json({ message: "Failed to invite judge" });
  }
};

export const logout = async (req: any, res: any) => {
  const accessToken = req.cookies.token as string;
  const refreshToken = req.cookies.refreshToken as string;
  const user = req.user as User;

  try {
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
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Failed to logout user" });
  }
};

export const logoutAll = async (req: any, res: any) => {
  const user = req.user as User;

  try {
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
  } catch (error) {
    console.error("Error during logout of all devices:", error);
    return res
      .status(500)
      .json({ message: "Failed to logout from all devices" });
  }
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

  try {
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
        contactFirstName,
        contactLastName,
        contactRelationship,
        contactPhoneNumber,
      },
    });
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

export const updatePassword = async (req: any, res: any) => {
  const user = req.user as User;
  const { newPassword } = req.body as {
    newPassword: string;
  };

  try {
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
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Failed to update password" });
  }
};

export const deleteUser = async (req: any, res: any) => {
  const user = req.user as User;

  try {
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
          participants: event.participants.filter(
            (userId) => userId !== user.id
          ),
        },
      });
    });
    await user.workshops.forEach(async (workshopId) => {
      const workshop = await prisma.workshop.findUnique({
        where: { id: workshopId },
      });
      if (!workshop) {
        return;
      }
      await prisma.workshop.update({
        where: { id: workshopId },
        data: {
          participants: workshop.participants.filter(
            (userId) => userId !== user.id
          ),
        },
      });
    });

    await prisma.user.delete({
      where: { id: user.id },
    });
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};
