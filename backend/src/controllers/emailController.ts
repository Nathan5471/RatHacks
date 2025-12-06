import { GradeLevel, User } from "@prisma/client";
import prisma from "../prisma/client";
import sendCustomEmail from "../utils/sendCustomEmail";
import { marked } from "marked";

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
    const emailData = await prisma.email.findUnique({
      where: { id },
    });

    if (!emailData) {
      return res.status(404).json({ message: "Email not found" });
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
    const email = await prisma.email.findUnique({
      where: { id },
    });
    if (!email) {
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

export const getAllReceipients = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const allReceipients = await prisma.user.findMany();

    return res
      .status(200)
      .json({ message: "Emails loaded successfully", allReceipients });
  } catch (error) {
    console.error("Error loading workshops for organizer:", error);
    return res.status(500).json({ message: "Failed to load workshops" });
  }
};

export const getReceipientsByFilter = async (req: any, res: any) => {
  const user = req.user as User;
  const { filter, id } = req.params as { filter: string; id: any };

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    let receipientData;
    switch (filter) {
      case "gradeLevel":
        receipientData = await prisma.user.findMany({
          where: { gradeLevel: id },
        });
        break;
      case "school":
        receipientData = await prisma.user.findMany({
          where: { schoolDivision: id },
        });
        break;
      case "workshop":
        receipientData = await prisma.user.findMany({
          where: { workshops: { has: id } },
        });
        break;
      case "event":
        receipientData = await prisma.user.findMany({
          where: { events: { has: id } },
        });
        break;
    }

    if (!receipientData) {
      return res
        .status(404)
        .json({ message: `No participants found in ${filter}` });
    }

    return res
      .status(200)
      .json({ message: "Email loaded successfully", receipientData });
  } catch (error) {
    console.error("Error loading email:", error);
    return res.status(500).json({ message: "Failed to load email" });
  }
};

export const sendEmail = async (req: any, res: any) => {
  const { id } = req.params as { id: any };
  const organizer = req.user as User;

  if (organizer.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const email = await prisma.email.findUnique({
      where: { id },
    });
    if (!email) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (email.sent !== false) {
      return res.status(400).json({ message: "Email already sent" });
    }

    let receipientData;
    switch (email.filterBy) {
      case "gradeLevel":
        receipientData = await prisma.user.findMany({
          where: { gradeLevel: email.subFilterBy as GradeLevel },
        });
        break;
      case "school":
        receipientData = await prisma.user.findMany({
          where: { schoolDivision: email.subFilterBy },
        });
        break;
      case "workshop":
        receipientData = await prisma.user.findMany({
          where: { workshops: { has: email.subFilterBy } },
        });
        break;
      case "event":
        receipientData = await prisma.user.findMany({
          where: { events: { has: email.subFilterBy } },
        });
        break;
      case null:
        receipientData = await prisma.user.findMany();
        break;
    }

    if (!receipientData || receipientData.length == 0) {
      return res
        .status(404)
        .json({ message: `No participants found in ${email.filterBy}` });
    }

    const emailVerifiedParticipants = receipientData.filter(
      (participant) => participant.emailVerified === true
    );
    const hasRatHacksEmail = organizer.email.endsWith("@rathacks.com") ?? false;

    const renderer = new marked.Renderer();
    renderer.heading = ({ text, depth }) => {
      const sizes = {
        1: "36px",
        2: "30px",
        3: "24px",
        4: "20px",
        5: "18px",
      };
      return `<h${depth} style="font-size: ${
        sizes[depth as 1 | 2 | 3 | 4 | 5] || "16px"
      }; font-weight: bold; margin: 0 0 10px;">${text}</h${depth}>`;
    };
    renderer.list = (token) => {
      const items = token.items
        .map((item) => `<li style="margin-bottom: 5px;">${item.text}</li>`)
        .join("");
      return `<${token.ordered ? "ol" : "ul"} style="list-style:${
        token.ordered ? "decimal" : "disc"
      }; padding-left:20px;">${items}</ul>`;
    };

    emailVerifiedParticipants.forEach(async (participant, index) => {
      const filledMessageBody = email.messageBody
        .replace("{firstName}", participant.firstName)
        .replace("{lastName}", participant.lastName);
      const html = await marked(filledMessageBody, { renderer });
      setTimeout(() => {
        sendCustomEmail({
          email: participant.email,
          messageBody: html,
          messageSubject: email.messageSubject,
          senderName: hasRatHacksEmail ? organizer.firstName : "Nathan",
          senderEmail: hasRatHacksEmail
            ? organizer.email
            : "nathan@rathacks.com",
        });
      }, (index / 2) * 1000);
    });

    await prisma.email.update({
      where: { id },
      data: {
        sent: true,
      },
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending emails", error);
    return res.status(500).json({ message: "Failed to send emails" });
  }
};
