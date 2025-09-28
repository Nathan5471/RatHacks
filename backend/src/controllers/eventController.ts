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
        teams: [],
        projects: [],
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
    if (event.status !== "upcoming") {
      return res
        .status(400)
        .json({ message: "Cannot join event that has started" });
    }

    const teams = await prisma.team.findMany();
    const currentJoinCodes = teams.map((team) => team.joinCode);
    let newJoinCode = Math.random().toString(36).substring(2, 8);
    while (currentJoinCodes.includes(newJoinCode)) {
      newJoinCode = Math.random().toString(36).substring(2, 8);
    }
    const newTeam = await prisma.team.create({
      data: {
        joinCode: newJoinCode,
        members: [user.id],
        eventId: id,
      },
    });

    await prisma.event.update({
      where: { id },
      data: {
        participants: event.participants?.concat(user.id) || [user.id],
        teams: event.teams?.concat(newTeam.id) || [newTeam.id],
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
    if (event.status !== "upcoming") {
      return res
        .status(400)
        .json({ message: "Cannot leave event that has started" });
    }

    const teams = await prisma.team.findMany({
      where: { eventId: id },
    });
    const userTeam = teams.find((team) => team.members.includes(user.id));
    let isTeamDeleted = false;
    if (userTeam) {
      if (userTeam.members.length === 1) {
        await prisma.team.delete({
          where: { id: userTeam.id },
        });
        isTeamDeleted = true;
      } else {
        await prisma.team.update({
          where: { id: userTeam.id },
          data: {
            members: userTeam.members.filter(
              (memberId) => memberId !== user.id
            ),
          },
        });
      }
    }
    await prisma.event.update({
      where: { id },
      data: {
        participants: event.participants?.filter(
          (userId) => userId !== user.id
        ),
        teams: isTeamDeleted
          ? event.teams.filter((teamId) => teamId !== userTeam?.id)
          : event.teams,
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

export const joinTeam = async (req: any, res: any) => {
  const { eventId, joinCode } = req.params as {
    eventId: string;
    joinCode: string;
  };
  const user = req.user as User;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (!event.participants.includes(user.id)) {
      return res.status(400).json({ message: "User has not joined event" });
    }
    if (event.status === "completed") {
      return res.status(400).json({ message: "Event has already completed" });
    }

    const teamToJoin = await prisma.team.findUnique({
      where: { joinCode },
    });
    if (!teamToJoin || teamToJoin.eventId !== eventId) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (teamToJoin.members.includes(user.id)) {
      return res.status(200).json({ message: "User already in team" });
    }
    if (teamToJoin.members.length >= 4) {
      return res.status(400).json({ message: "Team is already full" });
    }

    const userTeam = await prisma.team.findFirst({
      where: { eventId, members: { has: user.id } },
    });
    if (userTeam) {
      if (userTeam.submittedProject) {
        return res
          .status(400)
          .json({ message: "Cannot leave team after submitting project" });
      }
      if (userTeam.members.length === 1) {
        await prisma.team.delete({
          where: { id: userTeam.id },
        });
        await prisma.event.update({
          where: { id: eventId },
          data: {
            teams: event.teams.filter((teamId) => teamId !== userTeam.id),
          },
        });
      } else {
        await prisma.team.update({
          where: { id: userTeam.id },
          data: {
            members: userTeam.members.filter(
              (memberId) => memberId !== user.id
            ),
          },
        });
      }
    }

    await prisma.team.update({
      where: { joinCode },
      data: {
        members: teamToJoin.members.concat(user.id),
      },
    });
    return res.status(200).json({ message: "Joined team successfully" });
  } catch (error) {
    console.error("Error joining team:", error);
    return res.status(500).json({ message: "Failed to join team" });
  }
};

export const leaveTeam = async (req: any, res: any) => {
  const { eventId } = req.params as { eventId: string };
  const user = req.user as User;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (!event.participants.includes(user.id)) {
      return res.status(400).json({ message: "User has not joined event" });
    }
    if (event.status === "completed") {
      return res.status(400).json({ message: "Event has already completed" });
    }

    const userTeam = await prisma.team.findFirst({
      where: { eventId, members: { has: user.id } },
    });
    if (!userTeam) {
      const teams = await prisma.team.findMany();
      const currentJoinCodes = teams.map((team) => team.joinCode);
      let newJoinCode = Math.random().toString(36).substring(2, 8);
      while (currentJoinCodes.includes(newJoinCode)) {
        newJoinCode = Math.random().toString(36).substring(2, 8);
      }
      const newTeam = await prisma.team.create({
        data: {
          joinCode: newJoinCode,
          members: [user.id],
          eventId: eventId,
        },
      });
      await prisma.event.update({
        where: { id: eventId },
        data: {
          teams: event.teams?.concat(newTeam.id) || [newTeam.id],
        },
      });
      return res.status(200).json({ message: "User is not in a team" });
    }
    if (userTeam.submittedProject) {
      return res
        .status(400)
        .json({ message: "Cannot leave team after submitting project" });
    }
    if (userTeam.members.length === 1) {
      return res
        .status(400)
        .json({ message: "Cannot leave team as the only member" });
    }
    await prisma.team.update({
      where: { id: userTeam.id },
      data: {
        members: userTeam.members.filter((memberId) => memberId !== user.id),
      },
    });
    const teams = await prisma.team.findMany();
    const currentJoinCodes = teams.map((team) => team.joinCode);
    let newJoinCode = Math.random().toString(36).substring(2, 8);
    while (currentJoinCodes.includes(newJoinCode)) {
      newJoinCode = Math.random().toString(36).substring(2, 8);
    }
    const newTeam = await prisma.team.create({
      data: {
        joinCode: newJoinCode,
        members: [user.id],
        eventId: eventId,
      },
    });
    await prisma.event.update({
      where: { id: eventId },
      data: {
        teams: event.teams?.concat(newTeam.id) || [newTeam.id],
      },
    });
    return res.status(200).json({ message: "Left team successfully" });
  } catch (error) {
    console.error("Error leaving team:", error);
    return res.status(500).json({ message: "Failed to leave team" });
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
      status: event.status,
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
    const filledEvents = await Promise.all(
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
        const eventTeams = await prisma.team.findMany({
          where: { eventId: event.id },
        });
        return {
          id: event.id,
          name: event.name,
          description: event.description,
          location: event.location,
          startDate: event.startDate,
          endDate: event.endDate,
          submissionDeadline: event.submissionDeadline,
          status: event.status,
          participants: removedUneccesaryFieldsUsers,
          teams: eventTeams,
          createdBy: event.createdBy,
          createdAt: event.createdAt,
        };
      })
    );
    return res.status(200).json({
      message: "Events loaded successfully",
      events: filledEvents,
    });
  } catch (error) {
    console.error("Error loading events for organizer:", error);
    return res.status(500).json({ message: "Failed to load events" });
  }
};

export const getEventById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isUserParticipant = event.participants.includes(user.id);
    let removedUneccesaryFieldsTeam = null;
    if (isUserParticipant) {
      const userTeam = await prisma.team.findFirst({
        where: { eventId: id, members: { has: user.id } },
      });
      if (userTeam) {
        const members = await Promise.all(
          userTeam?.members.map(async (memeberId) => {
            const member = await prisma.user.findUnique({
              where: { id: memeberId },
            });
            return member;
          })
        );
        const filteredMembers = members.filter((member) => member !== null);
        const removedUneccesaryFieldsUsers = filteredMembers.map(
          (member) => `${member.firstName} ${member.lastName}`
        );
        removedUneccesaryFieldsTeam = {
          id: userTeam.id,
          joinCode: userTeam.joinCode,
          members: removedUneccesaryFieldsUsers,
          submittedProject: userTeam.submittedProject,
          project: userTeam.project,
        };
      }
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
        status: event.status,
        participantCount: event.participants.length,
        team: removedUneccesaryFieldsTeam,
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
    const teams = await prisma.team.findMany({
      where: { eventId: event.id },
    });
    const filledEvent = {
      id: event.id,
      name: event.name,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      submissionDeadline: event.submissionDeadline,
      status: event.status,
      participants: removedUneccesaryFieldsUsers,
      teams: teams,
      createdBy: event.createdBy,
      createdAt: event.createdAt,
    };
    return res
      .status(200)
      .json({ message: "Event loaded successfully", event: filledEvent });
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
