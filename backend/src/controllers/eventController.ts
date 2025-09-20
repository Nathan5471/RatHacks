import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const createEvent = async (req: any, res: any) => {
  const { name, description, startDate, endDate, submissionDeadline } =
    req.body as {
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

export const getAllEvents = async (req: any, res: any) => {
  const allEvents = await prisma.event.findMany();
  const events = allEvents.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    submissionDeadline: event.submissionDeadline,
    participantCount: event.participants.length,
  }));
  res.status(200).json({ message: "Events loaded successfully", events });
};

export const organizerGetAllEvents = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const events = await prisma.event.findMany();
  const userFilledEvents = await Promise.all(
    events.map(async (event) => {
      const users = await Promise.all(
        event.participants.map(async (user) => {
          const userData = await prisma.user.findUnique({
            where: { id: user },
          });
          return userData;
        })
      );
      const filteredUsers = users.filter((user) => user !== null);
      const removedUneccesaryFieldsUsers = filteredUsers.map((user) => ({
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        accountType: user.accountType,
        firstName: user.firstName,
        lastName: user.lastName,
        schoolDivision: user.schoolDivision,
        gradeLevel: user.gradeLevel,
        isGovSchool: user.isGovSchool,
        createdAt: user.createdAt,
      }));
      return {
        id: event.id,
        name: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        submissionDeadline: event.submissionDeadline,
        participants: removedUneccesaryFieldsUsers,
        createdBy: event.createdBy,
        createdAt: event.createdAt,
      };
    })
  );
  res
    .status(200)
    .json({ message: "Events loaded successfully", events: userFilledEvents });
};
