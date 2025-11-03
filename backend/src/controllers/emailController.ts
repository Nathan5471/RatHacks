import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const createEmails = async (req: any, res: any) => {
  const { name, messageSubject, messageBody, senderEmail, receiversEmails } = req.body as {
    name: string;
    messageSubject: string;
    messageBody: string;
    senderEmail: string;
    receiversEmails: string[];
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const workshop = await prisma.email.create({
      data: {
        name,
        messageSubject,
        messageBody,
        senderEmail,
        receiversEmails
      },
    });
    return res
      .status(201)
      .json({ message: "Workshop created successfully", id: workshop.id });
  } catch (error) {
    console.error("Error creating workshop:", error);
    return res.status(500).json({ message: "Failed to create workshop" });
  }
};