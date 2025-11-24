import bcrypt from "bcrypt";
import prisma from "../prisma/client";
import { User } from "@prisma/client";
import generateToken from "../utils/generateToken";
import generateRefreshToken from "../utils/generateRefreshToken";
import sendEmailVerificationEmail from "../utils/sendEmailVerificationEmail";
import sendResetPasswordEmail from "../utils/sendResetPasswordEmail";
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

export const resetPassword = async (req: any, res: any) => {
  const { email } = req.body as { email: string };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(200)
        .json({ message: "Password reset email sent if there is an account" });
    }
    if (user.passwordResetExpiry && user.passwordResetExpiry > new Date()) {
      return res.status(429).json({
        message: "You can only request a password reset once every 15 minutes",
      });
    }

    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const resetExpiry = new Date();
    resetExpiry.setMinutes(resetExpiry.getMinutes() + 15);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });
    await sendResetPasswordEmail({
      email: user.email,
      token: resetToken,
      firstName: user.firstName,
    });

    return res
      .status(200)
      .json({ message: "Password reset email sent if there is an account" });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

export const setNewPassword = async (req: any, res: any) => {
  const { email, token, newPassword } = req.body as {
    email: string;
    token: string;
    newPassword: string;
  };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      user.passwordResetToken !== token ||
      !user.passwordResetExpiry ||
      user.passwordResetExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid email or token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        validAccessTokens: [],
        validRefreshTokens: [],
      },
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error setting new password:", error);
    return res.status(500).json({ message: "Failed to set new password" });
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

export const registerOrganizer = async (req: any, res: any) => {
  const { email, password, firstName, lastName, token } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
  };

  try {
    const invite = await prisma.invite.findUnique({ where: { token } });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }
    if (
      invite.email !== email ||
      invite.role !== "organizer" ||
      new Date().getTime() > new Date(invite.expires).getTime()
    ) {
      return res.status(400).json({ message: "Invalid invite" });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await prisma.user.create({
      data: {
        email,
        emailToken,
        accountType: "organizer",
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
    await sendEmailVerificationEmail({ email, token: emailToken, firstName });
    await prisma.invite.delete({ where: { token } });
    return res
      .status(201)
      .json({ message: "Organizer registered successfully" });
  } catch (error) {
    console.error("Error registering organizer:", error);
    return res.status(500).json({ message: "Failed to register organizer" });
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

export const registerJudge = async (req: any, res: any) => {
  const { email, password, firstName, lastName, token } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;
  };

  try {
    const invite = await prisma.invite.findUnique({ where: { token } });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }
    if (
      invite.email !== email ||
      invite.role !== "judge" ||
      new Date().getTime() > new Date(invite.expires).getTime()
    ) {
      return res.status(400).json({ message: "Invalid invite" });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await prisma.user.create({
      data: {
        email,
        emailToken,
        accountType: "judge",
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
    await sendEmailVerificationEmail({ email, token: emailToken, firstName });
    await prisma.invite.delete({ where: { token } });
    return res.status(201).json({ message: "Judge registered successfully" });
  } catch (error) {
    console.error("Error registering judge:", error);
    return res.status(500).json({ message: "Failed to register judge" });
  }
};

export const cancelInvite = async (req: any, res: any) => {
  const user = req.user as User;
  const { email } = req.body as { email: string };

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const invite = await prisma.invite.findFirst({ where: { email } });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    await prisma.invite.delete({ where: { token: invite.token } });
    return res.status(200).json({ message: "Invite cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling invite:", error);
    return res.status(500).json({ message: "Failed to cancel invite" });
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

export const checkResetPassword = async (req: any, res: any) => {
  const { email, token } = req.query as { email: string; token: string };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      user.passwordResetToken !== token ||
      !user.passwordResetExpiry ||
      user.passwordResetExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid email or token" });
    }

    return res.status(200).json({ message: "Reset password token is valid" });
  } catch (error) {
    console.error("Error checking reset password token:", error);
    return res.status(500).json({ message: "Failed to check reset password" });
  }
};

export const checkInvite = async (req: any, res: any) => {
  const { email, token } = req.query as { email: string; token: string };
  const type = req.type;

  try {
    const invite = await prisma.invite.findUnique({
      where: { token },
    });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }
    if (
      invite.email !== email ||
      invite.role !== type ||
      new Date().getTime() > new Date(invite.expires).getTime()
    ) {
      return res.status(400).json({ message: "Invalid invite" });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    return res.status(200).json({ message: "Invite is valid" });
  } catch (error) {
    console.error("Error checking invite:", error);
    return res.status(500).json({ message: "Failed to check invite" });
  }
};

export const getInvites = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const invites = await prisma.invite.findMany();
    const filteredExpiredInvites = invites.filter((invite) => {
      return new Date() < new Date(invite.expires);
    });
    const removedTokenInvites = filteredExpiredInvites.map((invite) => ({
      email: invite.email,
      role: invite.role,
      expires: invite.expires,
    }));
    return res.status(200).json({
      message: "Invites retrieved successfully",
      invites: removedTokenInvites,
    });
  } catch (error) {
    console.error("Error getting invites:", error);
    return res.status(500).json({ message: "Failed to get invites" });
  }
};

export const getAllUsers = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const users = await prisma.user.findMany({});
    const filteredUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      accountType: user.accountType,
      theme: user.theme,
      firstName: user.firstName,
      lastName: user.lastName,
      schoolDivision: user.schoolDivision,
      gradeLevel: user.gradeLevel,
      isGovSchool: user.isGovSchool,
      techStack: user.techStack,
      previousHackathon: user.previousHackathon,
      parentFirstName: user.parentFirstName,
      parentLastName: user.parentLastName,
      parentEmail: user.parentEmail,
      parentPhoneNumber: user.parentPhoneNumber,
      contactFirstName: user.contactFirstName,
      contactLastName: user.contactLastName,
      contactRelationship: user.contactRelationship,
      contactPhoneNumber: user.contactPhoneNumber,
      createdAt: user.createdAt,
    }));
    return res
      .status(200)
      .json({ message: "Users retrieved successfully", users: filteredUsers });
  } catch (error) {
    console.error("Error getting all users:", error);
    return res.status(500).json({ message: "Failed to get all users" });
  }
};

export const getStats = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const totalUsers = await prisma.user.count();
    const verifiedEmailUsers = await prisma.user.count({
      where: { emailVerified: true },
    });
    const govSchoolUsers = await prisma.user.count({
      where: { isGovSchool: true },
    });
    const studentUsers = await prisma.user.count({
      where: { accountType: "student" },
    });
    const organizerUsers = await prisma.user.count({
      where: { accountType: "organizer" },
    });
    const judgeUsers = await prisma.user.count({
      where: { accountType: "judge" },
    });
    const regularTheme = await prisma.user.count({
      where: { theme: "default" },
    });
    const spookyTheme = await prisma.user.count({
      where: { theme: "spooky" },
    });
    const spaceTheme = await prisma.user.count({
      where: { theme: "space" },
    });
    const frameworkTheme = await prisma.user.count({
      where: { theme: "framework" },
    });
    const workshops = await prisma.workshop.findMany();
    const totalWorkshopParticipants = workshops.reduce((acc, workshop) => {
      return acc + (workshop.participants ? workshop.participants.length : 0);
    }, 0);
    const events = await prisma.event.findMany();
    const totalEventParticipants = events.reduce((acc, event) => {
      return acc + (event.participants ? event.participants.length : 0);
    }, 0);
    const averageShipRate =
      events.reduce((acc, event) => {
        return acc + event.projects.length / (event.participants?.length || 1);
      }, 0) / events.length;
    const projects = await prisma.project.count();
    const judgeFeedbacks = await prisma.judgeFeedback.findMany();
    const averageCreativityScore =
      judgeFeedbacks.reduce((acc, feedback) => {
        return acc + feedback.creativityScore;
      }, 0) / judgeFeedbacks.length;
    const averageFunctionalityScore =
      judgeFeedbacks.reduce((acc, feedback) => {
        return acc + feedback.functionalityScore;
      }, 0) / judgeFeedbacks.length;
    const averageTechnicalityScore =
      judgeFeedbacks.reduce((acc, feedback) => {
        return acc + feedback.technicalityScore;
      }, 0) / judgeFeedbacks.length;
    const averageInterfaceScore =
      judgeFeedbacks.reduce((acc, feedback) => {
        return acc + feedback.interfaceScore;
      }, 0) / judgeFeedbacks.length;
    const averageScore =
      judgeFeedbacks.reduce((acc, feedback) => {
        return acc + feedback.totalScore;
      }, 0) / judgeFeedbacks.length;

    return res.status(200).json({
      message: "Stats retrieved successfully",
      stats: {
        totalUsers,
        verifiedEmailUsers,
        govSchoolUsers,
        studentUsers,
        organizerUsers,
        judgeUsers,
        regularTheme,
        spookyTheme,
        spaceTheme,
        frameworkTheme,
        workshops: workshops.length,
        totalWorkshopParticipants,
        events: events.length,
        totalEventParticipants,
        averageShipRate,
        projects,
        averageCreativityScore,
        averageFunctionalityScore,
        averageTechnicalityScore,
        averageInterfaceScore,
        averageScore,
      },
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    return res.status(500).json({ message: "Failed to get stats" });
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

export const updateTheme = async (req: any, res: any) => {
  const { theme } = req.body as {
    theme: "default" | "spooky" | "space" | "framework";
  };
  const user = req.user as User;

  if (user.theme === theme) {
    return res.status(200).json({ message: "Theme updated successfully" });
  }
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        theme,
      },
    });
    return res.status(200).json({ message: "Theme updated successfully" });
  } catch (error) {
    console.error("Error updating theme:", error);
    return res.status(500).json({ message: "Failed to update theme" });
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
