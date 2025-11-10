import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const createEmail = async (req: any, res: any) => {
  const { name, messageSubject, messageBody, sendAll, filterBy, subFilterBy } =
    req.body as {
      name: string;
      messageSubject: string;
      messageBody: string;
      sendAll: boolean;
      filterBy: string | null;
      subFilterBy: string | null;
    };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const email = await prisma.email.create({
      data: {
        name,
        messageSubject,
        messageBody,
        sendAll,
        filterBy,
        subFilterBy,
      },
    });
    return res
      .status(201)
      .json({ message: "email created successfully", id: email.id });
  } catch (error) {
    console.error("Error creating email:", error);
    return res.status(500).json({ message: "Failed to create email" });
  }
};

export const organizerGetAllEmails = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const allEmails = await prisma.email.findMany();
    // console.log("all emails", allEmails);
    return res
      .status(200)
      .json({ message: "Emails loaded successfully", allEmails });
  } catch (error) {
    console.error("Error loading workshops for organizer:", error);
    return res.status(500).json({ message: "Failed to load workshops" });
  }
};

export const updateEmail = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const {
    name,
    messageSubject,
    messageBody,
    sendAll,
    filterBy,
    subFilterBy,
    sent,
  } = req.body as {
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
    sent: boolean;
  };

  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const email = await prisma.email.findUnique({
      where: { id },
    });
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    await prisma.email.update({
      where: { id },
      data: {
        name,
        messageSubject,
        messageBody,
        sendAll,
        filterBy,
        subFilterBy,
        sent,
      },
    });
    return res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Error updating email:", error);
    return res.status(500).json({ message: "Failed to update email" });
  }
};

export const organizerGetEmailById = async (req: any, res: any) => {
  const user = req.user as User;
  const { id } = req.params as { id: string };

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    console.log("finding emails...");
    const emailData = await prisma.email.findUnique({
      where: { id },
    });
    if (!emailData) {
      return res.status(404).json({ message: "Email not found" });
    } else {
      console.log("email successfully loaded", emailData);
    }

    const email = {
      id: emailData.id,
      name: emailData.name,
      messageSubject: emailData.messageSubject,
      messageBody: emailData.messageBody,
      sendAll: emailData.sendAll,
      filterBy: emailData.filterBy,
      subFilterBy: emailData.subFilterBy,
      sent: emailData.sent,
    };
    return res
      .status(200)
      .json({ message: "Email loaded successfully", email });
  } catch (error) {
    console.error("Error loading email:", error);
    return res.status(500).json({ message: "Failed to load email" });
  }
};

export const deleteEmail = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const event = await prisma.email.findUnique({
      where: { id },
    });
    if (!event) {
      return res.status(404).json({ message: "Email not found" });
    }

    await prisma.email.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Email deleted successfully" });
  } catch (error) {
    console.error("Error deleting email:", error);
    return res.status(500).json({ message: "Failed to delete email" });
  }
};
