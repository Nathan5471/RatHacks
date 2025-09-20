import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const createEvent = async (req: any, res: any) => {
  const { name, description, startDate, endDate, submissionDeadline } =
    req.bobdy as {
      name: string;
      description: string;
      startDate: string;
      endDate: string;
      submissionDeadline: string;
    };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const event = await prisma.event.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      submissionDeadline: new Date(submissionDeadline),
      participants: [],
      createdBy: user.id,
    },
  });
  res.status(201).json({ message: "Event created successfully", id: event.id });
};
