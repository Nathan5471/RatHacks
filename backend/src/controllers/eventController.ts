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

  try {
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
    return res
      .status(201)
      .json({ message: "Event created successfully", id: event.id });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Failed to create event" });
  }
};

export const joinEvent = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  try {
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
    return res.status(200).json({ message: "Joined event successfully" });
  } catch (error) {
    console.error("Error joining event:", error);
    return res.status(500).json({ message: "Failed to join event" });
  }
};

export const leaveEvent = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  try {
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
        participants: event.participants?.filter(
          (userId) => userId !== user.id
        ),
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        events: user.events.filter((eventId) => eventId !== id),
      },
    });
    return res.status(200).json({ message: "Left event successfully" });
  } catch (error) {
    console.error("Error leaving event:", error);
    return res.status(500).json({ message: "Failed to leave event" });
  }
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

  try {
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
    return res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Failed to update event" });
  }
};

export const getAllEvents = async (req: any, res: any) => {
  try {
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
  } catch (error) {
    console.error("Error loading events:", error);
    return res.status(500).json({ message: "Failed to load events" });
  }
};

export const organizerGetAllEvents = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
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
          techStack: user.techStack,
          previousHackathon: user.previousHackathon,
          parentFirstName: user.parentFirstName,
          parentLastName: user.parentLastName,
          parentEmail: user.parentEmail,
          parentPhoneNumber: user.parentPhoneNumber,
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
    return res.status(200).json({
      message: "Events loaded successfully",
      events: userFilledEvents,
    });
  } catch (error) {
    console.error("Error loading events for organizer:", error);
    return res.status(500).json({ message: "Failed to load events" });
  }
};

export const getEventById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({
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
  } catch (error) {
    console.error("Error loading event:", error);
    return res.status(500).json({ message: "Failed to load event" });
  }
};

export const organizerGetEventById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
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
      emailVerified: user.emailVerified,
      accountType: user.accountType,
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
    return res
      .status(200)
      .json({ message: "Event loaded successfully", event: userFilledEvent });
  } catch (error) {
    console.error("Error loading event for organizer:", error);
    return res.status(500).json({ message: "Failed to load event" });
  }
};

export const deleteEvent = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
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
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Failed to delete event" });
  }
};
