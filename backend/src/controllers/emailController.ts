import { AccountType, GradeLevel, User } from "@prisma/client";
import prisma from "../prisma/client";
import sendCustomEmail from "../utils/sendCustomEmail";
import { marked } from "marked";

export const createEmail = async (req: any, res: any) => {
  const {
    name,
    messageSubject,
    messageBody,
    sendAll,
    filterBy,
    subFilterBy,
    sendOnJoin,
  } = req.body as {
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
    sendOnJoin: boolean | null;
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
        sendOnJoin: sendOnJoin ?? false,
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
    sendOnJoin,
  } = req.body as {
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
    sendOnJoin: boolean | null;
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
        sendOnJoin:
          !sendAll &&
          (filterBy === "event" || filterBy === "workshop") &&
          subFilterBy &&
          sendOnJoin !== null
            ? sendOnJoin
            : false,
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

    return res
      .status(200)
      .json({ message: "Email loaded successfully", email: emailData });
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
    let recipientData;
    switch (filter) {
      case "gradeLevel":
        recipientData = await prisma.user.findMany({
          where: { gradeLevel: id },
        });
        break;
      case "school":
        recipientData = await prisma.user.findMany({
          where: { schoolDivision: id },
        });
        break;
      case "workshop":
        recipientData = await prisma.user.findMany({
          where: { workshops: { has: id } },
        });
        break;
      case "event":
        recipientData = await prisma.user.findMany({
          where: { events: { has: id } },
        });
        break;
      case "accountType":
        recipientData = await prisma.user.findMany({
          where: { accountType: id },
        });
        break;
      case "emailList":
        recipientData = await prisma.user.findMany({
          where: { emailLists: { has: id } },
        });
        break;
    }

    if (!recipientData || recipientData.length === 0) {
      return res
        .status(404)
        .json({ message: `No participants found in ${filter}` });
    }

    return res
      .status(200)
      .json({ message: "Email loaded successfully", recipientData });
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

    let recipientData;
    switch (email.filterBy) {
      case "gradeLevel":
        recipientData = await prisma.user.findMany({
          where: { gradeLevel: email.subFilterBy as GradeLevel },
        });
        break;
      case "school":
        recipientData = await prisma.user.findMany({
          where: { schoolDivision: email.subFilterBy },
        });
        break;
      case "workshop":
        recipientData = await prisma.user.findMany({
          where: { workshops: { has: email.subFilterBy } },
        });
        break;
      case "event":
        recipientData = await prisma.user.findMany({
          where: { events: { has: email.subFilterBy } },
        });
        break;
      case "accountType":
        recipientData = await prisma.user.findMany({
          where: { accountType: email.subFilterBy as AccountType },
        });
        break;
      case "emailList":
        recipientData = await prisma.user.findMany({
          where: { emailLists: { has: email.subFilterBy } },
        });
        break;
      case null:
        recipientData = await prisma.user.findMany();
        break;
    }

    if (!recipientData || recipientData.length === 0) {
      return res
        .status(404)
        .json({ message: `No participants found in ${email.filterBy}` });
    }

    const emailVerifiedRecipients = recipientData.filter(
      (participant) => participant.emailVerified === true,
    );
    const unsentRecipients = emailVerifiedRecipients.filter(
      (participant) => !email.sentTo.includes(participant.id),
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
      return `<${token.ordered ? "ol" : "ul"} style="list-style: ${
        token.ordered ? "decimal" : "disc"
      }; padding-left: 20px;">${items}</${token.ordered ? "ol" : "ul"}>`;
    };

    unsentRecipients.forEach(async (participant, index) => {
      const filledMessageBody = email.messageBody
        .replace("{firstName}", participant.firstName)
        .replace("{lastName}", participant.lastName);
      const html = await marked(filledMessageBody, { renderer });
      setTimeout(
        async () => {
          await sendCustomEmail({
            email: participant.email,
            messageBody: html,
            messageSubject: email.messageSubject,
            senderName: hasRatHacksEmail
              ? organizer.firstName.toLowerCase()
              : "nathan",
            senderEmail: hasRatHacksEmail
              ? organizer.email
              : "nathan@rathacks.com",
          });
          await prisma.email.update({
            where: { id },
            data: {
              sentTo: { push: participant.id },
              sentTimes: { push: new Date() },
            },
          });
        },
        (index / 2) * 1000,
      );
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending emails", error);
    return res.status(500).json({ message: "Failed to send emails" });
  }
};

export const activateEmail = async (req: any, res: any) => {
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
    if (!email.sendOnJoin) {
      return res
        .status(400)
        .json({ message: "Can't activate a non sendOnJoin email" });
    }
    if (email.active === true) {
      return res.status(200).json({ message: "Email already activated" });
    }
    await prisma.email.update({
      where: { id },
      data: {
        active: true,
      },
    });
    res.status(200).json({ message: "Email activated successfully" });

    let recipientData;
    switch (
      email.filterBy // Should only be possible with workshops and events
    ) {
      case "workshop":
        recipientData = await prisma.user.findMany({
          where: { workshops: { has: email.subFilterBy } },
        });
        break;
      case "event":
        recipientData = await prisma.user.findMany({
          where: { events: { has: email.subFilterBy } },
        });
        break;
    }

    if (!recipientData || recipientData.length == 0) {
      console.log(`No participants found in ${email.filterBy}`);
      return;
    }

    const emailVerifiedRecipients = recipientData.filter(
      (participant) => participant.emailVerified === true,
    );
    const unsentRecipients = emailVerifiedRecipients.filter(
      (participant) => !email.sentTo.includes(participant.id),
    );
    const hasRatHacksEmail = user.email.endsWith("@rathacks.com") ?? false;

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
      return `<${token.ordered ? "ol" : "ul"} style="list-style: ${
        token.ordered ? "decimal" : "disc"
      }; padding-left: 20px;">${items}</${token.ordered ? "ol" : "ul"}>`;
    };

    unsentRecipients.forEach(async (participant, index) => {
      const filledMessageBody = email.messageBody
        .replace("{firstName}", participant.firstName)
        .replace("{lastName}", participant.lastName);
      const html = await marked(filledMessageBody, { renderer });
      setTimeout(
        async () => {
          await sendCustomEmail({
            email: participant.email,
            messageBody: html,
            messageSubject: email.messageSubject,
            senderName: hasRatHacksEmail
              ? user.firstName.toLowerCase()
              : "nathan",
            senderEmail: hasRatHacksEmail ? user.email : "nathan@rathacks.com",
          });
          await prisma.email.update({
            where: { id },
            data: {
              sentTo: { push: participant.id },
              sentTimes: { push: new Date() },
            },
          });
        },
        (index / 2) * 1000,
      );
    });
  } catch (error) {
    console.error("Error activating email:", error);
    return res.status(500).json({ message: "Failed to activate email" });
  }
};

export const deactivateEmail = async (req: any, res: any) => {
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
    if (!email.sendOnJoin) {
      return res
        .status(400)
        .json({ message: "Can't deactivate a non sendOnJoin email" });
    }
    if (email.active === false) {
      return res.status(200).json({ message: "Email already deactivated" });
    }
    await prisma.email.update({
      where: { id },
      data: {
        active: false,
      },
    });
    return res.status(200).json({ message: "Email deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating email:", error);
    return res.status(500).json({ message: "Failed to deactivate email" });
  }
};

export const createEmailList = async (req: any, res: any) => {
  const { name, description } = req.body as {
    name: string;
    description?: string;
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const emailList = await prisma.emailList.create({
      data: {
        name,
        description,
      },
    });
    return res
      .status(201)
      .json({ message: "Email list created successfully", id: emailList.id });
  } catch (error) {
    console.error("Error creating email list:", error);
    return res.status(500).json({ message: "Failed to create email list" });
  }
};

export const updateEmailList = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { name, description } = req.body as {
    name: string;
    description?: string;
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const emailList = await prisma.emailList.findUnique({
      where: { id },
    });
    if (!emailList) {
      return res.status(404).json({ message: "Email list not found" });
    }
    await prisma.emailList.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
    return res.status(200).json({ message: "Email list updated successfully" });
  } catch (error) {
    console.error("Error updating email list:", error);
    return res.status(500).json({ message: "Failed to update email list" });
  }
};

export const deleteEmailList = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const emailList = await prisma.emailList.findUnique({
      where: { id },
    });
    if (!emailList) {
      return res.status(404).json({ message: "Email list not found" });
    }
    await prisma.emailList.delete({
      where: { id },
    });
    const usersToUpdate = await prisma.user.findMany({
      where: {
        emailLists: { has: id },
      },
    });
    for (const user of usersToUpdate) {
      const updatedLists = user.emailLists.filter((listId) => listId !== id);
      await prisma.user.update({
        where: { id: user.id },
        data: { emailLists: updatedLists },
      });
    }
    return res.status(200).json({ message: "Email list deleted successfully" });
  } catch (error) {
    console.error("Error deleting email list:", error);
    return res.status(500).json({ message: "Failed to delete email list" });
  }
};

export const getAllEmailLists = async (req: any, res: any) => {
  const { email, code } = req.query as { email?: string; code?: string };

  try {
    let user = null;
    if (email && code) {
      user = await prisma.user.findUnique({
        where: { email, emailListCode: code },
      });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or code" });
      }
    }
    let emailLists = await prisma.emailList.findMany();
    if (user) {
      emailLists = emailLists.map((list) => {
        const isMember = user?.emailLists.includes(list.id);
        return {
          ...list,
          isMember,
        };
      });
    }
    return res
      .status(200)
      .json({ message: "Email lists fetched successfully", emailLists });
  } catch (error) {
    console.error("Error fetching email lists:", error);
    return res.status(500).json({ message: "Failed to fetch email lists" });
  }
};

export const joinEmailList = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { email, code } = req.body as {
    email: string;
    code: string;
  };

  try {
    const user = await prisma.user.findUnique({
      where: { email, emailListCode: code },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or code" });
    }
    const emailList = await prisma.emailList.findUnique({
      where: { id },
    });
    if (!emailList) {
      return res.status(404).json({ message: "Email list not found" });
    }
    if (user.emailLists.includes(id)) {
      return res.status(200).json({ message: "Already a member of the list" });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailLists: { push: id },
      },
    });
    return res.status(200).json({ message: "Joined email list successfully" });
  } catch (error) {
    console.error("Error joining email list:", error);
    return res.status(500).json({ message: "Failed to join email list" });
  }
};

export const leaveEmailList = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { email, code } = req.body as {
    email: string;
    code: string;
  };

  try {
    const user = await prisma.user.findUnique({
      where: { email, emailListCode: code },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or code" });
    }
    const emailList = await prisma.emailList.findUnique({
      where: { id },
    });
    if (!emailList) {
      return res.status(404).json({ message: "Email list not found" });
    }
    if (!user.emailLists.includes(id)) {
      return res.status(200).json({ message: "Not a member of the list" });
    }
    const updatedLists = user.emailLists.filter((listId) => listId !== id);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailLists: updatedLists,
      },
    });
    return res.status(200).json({ message: "Left email list successfully" });
  } catch (error) {
    console.error("Error leaving email list:", error);
    return res.status(500).json({ message: "Failed to leave email list" });
  }
};
