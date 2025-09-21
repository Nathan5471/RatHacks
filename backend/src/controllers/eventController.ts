import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const createEvent = async (req: any, res: any) => {
  const {
    name,
    description,
    location,
    startDate,
    endDate,
    submissionDeadline,
  } = req.body as {
    name: string;
    description: string;
    location: string;
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
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      submissionDeadline: new Date(submissionDeadline),
      participants: [],
      createdBy: user.id,
    },
  });
  res.status(201).json({ message: "Event created successfully", id: event.id });
};

export const joinEvent = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (event.participants.includes(user.id)) {
    return res.status(200).json({ message: "User already joined event" });
  }

  await prisma.event.update({
    where: { id },
    data: {
      participants: event.participants?.concat(user.id) || [user.id],
    },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: {
      events: user.events?.concat(id) || [id],
    },
  });
  res.status(200).json({ message: "Joined event successfully" });
};

export const leaveEvent = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (!event.participants.includes(user.id)) {
    return res.status(200).json({ message: "User has not joined event" });
  }

  await prisma.event.update({
    where: { id },
    data: {
      participants: event.participants?.filter((userId) => userId !== user.id),
    },
  });
  await prisma.user.update({
    where: { id: user.id },
    data: {
      events: user.events.filter((eventId) => eventId !== id),
    },
  });
  res.status(200).json({ message: "Left event successfully" });
};

export const updateEvent = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const {
    name,
    description,
    location,
    startDate,
    endDate,
    submissionDeadline,
  } = req.body as {
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  await prisma.event.update({
    where: { id },
    data: {
      name,
      description,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      submissionDeadline: new Date(submissionDeadline),
    },
  });
  res.status(200).json({ message: "Event updated successfully" });
};

export const getAllEvents = async (req: any, res: any) => {
  const allEvents = await prisma.event.findMany();
  const events = allEvents.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    location: event.location,
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
        location: event.location,
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

export const getEventById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.status(200).json({
    message: "Event loaded successfully",
    event: {
      id: event.id,
      name: event.name,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      submissionDeadline: event.submissionDeadline,
      participantCount: event.participants.length,
    },
  });
};

export const organizerGetEventById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  const populatedParticipants = await Promise.all(
    event.participants.map(async (user) => {
      const userData = await prisma.user.findUnique({
        where: { id: user },
      });
      return userData;
    })
  );
  const filteredUsers = populatedParticipants.filter((user) => user !== null);
  const removedUneccesaryFieldsUsers = filteredUsers.map((user) => ({
    id: user.id,
    email: user.email,
    emailVerfied: user.emailVerified,
    AccountType: user.accountType,
    firstName: user.firstName,
    lastName: user.lastName,
    schoolDivision: user.schoolDivision,
    gradeLevel: user.gradeLevel,
    isGovSchool: user.isGovSchool,
    createdAt: user.createdAt,
  }));
  const userFilledEvent = {
    id: event.id,
    name: event.name,
    description: event.description,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    submissionDeadline: event.submissionDeadline,
    participants: removedUneccesaryFieldsUsers,
    createdBy: event.createdBy,
    createdAt: event.createdAt,
  };
  res
    .status(200)
    .json({ message: "Event loaded successfully", event: userFilledEvent });
};

export const deleteEvent = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const event = await prisma.event.findUnique({
    where: { id },
  });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  await event.participants.forEach(async (partcipant) => {
    const user = await prisma.user.findUnique({
      where: { id: partcipant },
    });
    if (!user) {
      return;
    }
    await prisma.user.update({
      where: { id: partcipant },
      data: {
        events: user.events.filter((eventId) => eventId !== id),
      },
    });
  });
  await prisma.event.delete({
    where: { id },
  });
  return res.status(200).json({ message: "Event deleted successfully" });
};
