import { Prisma, User } from "@prisma/client";
import prisma from "../prisma/client";
import sortEvents from "../utils/sortEvents";
import type { Event1, Event2, Event3 } from "../utils/sortEvents";
import sendJudgingEmails from "../utils/sendJudgingEmails";
import { marked } from "marked";
import sendCustomEmail from "../utils/sendCustomEmail";

export const createEvent = async (req: any, res: any) => {
  const {
    name,
    type,
    description,
    location,
    startDate,
    endDate,
    submissionDeadline,
  } = req.body as {
    name: string;
    type: "hackathon" | "ctf";
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
        type,
        description,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        submissionDeadline: new Date(submissionDeadline),
        createdById: user.id,
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
      include: { participants: true },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.status !== "upcoming") {
      return res
        .status(400)
        .json({ message: "Cannot join event that has started" });
    }
    if (event.participants.some((participant) => participant.id === user.id)) {
      return res.status(200).json({ message: "User already joined event" });
    }

    while (true) {
      try {
        const newJoinCode = Math.random().toString(36).substring(2, 8);
        await prisma.team.create({
          data: {
            joinCode: newJoinCode,
            members: { connect: { id: user.id } },
            eventId: id,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }
        console.error("Error creating team in join event:", error);
        return res.status(500).json({ message: "Failed to join event" });
      }
      break;
    }

    await prisma.event.update({
      where: { id },
      data: {
        participants: { connect: { id: user.id } },
      },
    });
    res.status(200).json({ message: "Joined event successfully" });

    const joinEmails = await prisma.email.findMany({
      where: {
        filterBy: "event",
        subFilterBy: event.id,
        sendOnJoin: true,
        active: true,
      },
      include: { sentTo: { select: { id: true, userId: true } } },
    });
    for (const email of joinEmails) {
      if (email.sentTo.some((sentTo) => sentTo.userId === user.id)) continue;
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
        }; padding-left:20px;">${items}</${token.ordered ? "ol" : "ul"}>`;
      };

      const filledMessageBody = email.messageBody
        .replace("{firstName}", user.firstName)
        .replace("{lastName}", user.lastName);
      const html = await marked.parse(filledMessageBody, { renderer });

      await sendCustomEmail({
        email: user.email,
        messageBody: html,
        messageSubject: email.messageSubject,
        senderName: "nathan",
        senderEmail: "nathan@rathacks.com",
      });
      await prisma.emailReceipt.create({
        data: {
          emailId: email.id,
          userId: user.id,
        },
      });
    }
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
      include: { participants: true },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.status !== "upcoming") {
      return res
        .status(400)
        .json({ message: "Cannot leave event that has started" });
    }
    if (!event.participants.some((participant) => participant.id === user.id)) {
      return res.status(200).json({ message: "User has not joined event" });
    }

    const userTeam = await prisma.team.findFirst({
      where: { eventId: id, members: { some: { id: user.id } } },
      include: { members: true },
    });
    if (userTeam) {
      if (userTeam.members.length === 1) {
        await prisma.team.delete({
          where: { id: userTeam.id },
        });
      } else {
        await prisma.team.update({
          where: { id: userTeam.id },
          data: {
            members: { disconnect: { id: user.id } },
          },
        });
      }
    }
    await prisma.event.update({
      where: { id },
      data: {
        participants: { disconnect: { id: user.id } },
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
      include: { participants: true },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.status === "completed") {
      return res.status(400).json({ message: "Event has already completed" });
    }
    if (!event.participants.some((participant) => participant.id === user.id)) {
      return res.status(400).json({ message: "User has not joined event" });
    }

    const teamToJoin = await prisma.team.findUnique({
      where: { joinCode },
      include: { members: true },
    });
    if (!teamToJoin || teamToJoin.eventId !== eventId) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (teamToJoin.members.some((member) => member.id === user.id)) {
      return res.status(200).json({ message: "User already in team" });
    }
    if (teamToJoin.members.length >= 4) {
      return res.status(400).json({ message: "Team is already full" });
    }

    const userTeam = await prisma.team.findFirst({
      where: { eventId, members: { some: { id: user.id } } },
      include: { members: true },
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
      } else {
        await prisma.team.update({
          where: { id: userTeam.id },
          data: {
            members: { disconnect: { id: user.id } },
          },
        });
      }
    }

    await prisma.team.update({
      where: { joinCode },
      data: {
        members: { connect: { id: user.id } },
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
      include: { participants: true },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.status === "completed") {
      return res.status(400).json({ message: "Event has already completed" });
    }
    if (!event.participants.some((participant) => participant.id === user.id)) {
      return res.status(400).json({ message: "User has not joined event" });
    }

    const userTeam = await prisma.team.findFirst({
      where: { eventId, members: { some: { id: user.id } } },
      include: { members: true },
    });
    if (!userTeam) {
      while (true) {
        try {
          const newJoinCode = Math.random().toString(36).substring(2, 8);
          await prisma.team.create({
            data: {
              joinCode: newJoinCode,
              members: { connect: { id: user.id } },
              eventId: eventId,
            },
          });
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            continue;
          }
          console.error("Error creating team in join event:", error);
          return res.status(500).json({ message: "Failed to join event" });
        }
        break;
      }
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
        members: { disconnect: { id: user.id } },
      },
    });
    while (true) {
      try {
        const newJoinCode = Math.random().toString(36).substring(2, 8);
        await prisma.team.create({
          data: {
            joinCode: newJoinCode,
            members: { connect: { id: user.id } },
            eventId: eventId,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          continue;
        }
        console.error("Error creating team in join event:", error);
        return res.status(500).json({ message: "Failed to join event" });
      }
      break;
    }
    return res.status(200).json({ message: "Left team successfully" });
  } catch (error) {
    console.error("Error leaving team:", error);
    return res.status(500).json({ message: "Failed to leave team" });
  }
};

export const checkInUser = async (req: any, res: any) => {
  const { eventId, userId } = req.params as {
    eventId: string;
    userId: string;
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const userToCheckIn = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userToCheckIn) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      !event.participants.some(
        (participant) => participant.id === userToCheckIn.id,
      )
    ) {
      while (true) {
        try {
          const newJoinCode = Math.random().toString(36).substring(2, 8);
          await prisma.team.create({
            data: {
              joinCode: newJoinCode,
              members: { connect: { id: user.id } },
              eventId: eventId,
            },
          });
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            continue;
          }
          console.error("Error creating team in join event:", error);
          return res.status(500).json({ message: "Failed to join event" });
        }
        break;
      }
      await prisma.event.update({
        where: { id: eventId },
        data: {
          participants: { connect: { id: userId } },
          checkedInParticipants: { connect: { id: userId } },
        },
      });
    } else {
      await prisma.event.update({
        where: { id: eventId },
        data: {
          checkedInParticipants: { connect: { id: userId } },
        },
      });
    }
    return res.status(200).json({ message: "User checked in successfully" });
  } catch (error) {
    console.error("Error checking in user:", error);
    return res.status(500).json({ message: "Failed to check in user" });
  }
};

export const releaseJudging = async (req: any, res: any) => {
  const { eventId } = req.params as { eventId: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const projectScores = {} as { [key: string]: number }; // This is the average total score for each project (x/40)
    const projects = await prisma.project.findMany({
      where: { eventId },
      include: { judgeFeedback: { select: { totalScore: true } } },
    });
    for (const project of projects) {
      if (project.judgeFeedback.length === 0) {
        projectScores[project.id] = 0;
      } else {
        const averageScore =
          project.judgeFeedback.reduce(
            (acc, score) => acc + score.totalScore,
            0,
          ) / project.judgeFeedback.length;
        projectScores[project.id] = averageScore;
      }
    }
    const rankedProjects = Object.entries(projectScores).sort(
      (a, b) => b[1] - a[1],
    );
    await Promise.all(
      rankedProjects.map(async ([projectId], index) => {
        await prisma.project.update({
          where: { id: projectId },
          data: { ranking: index + 1 },
        });
      }),
    );
    await prisma.event.update({
      where: { id: eventId },
      data: { releasedJudging: true },
    });
    res.status(200).json({ message: "Judging released successfully" });
    await sendJudgingEmails(eventId);
  } catch (error) {
    console.error("Error releasing judging:", error);
    return res.status(500).json({ message: "Failed to release judging" });
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
    const allEvents = await prisma.event.findMany({
      include: { _count: { select: { participants: true } } },
    });
    const sortedEvents = sortEvents(allEvents) as Event1[];
    const events = sortedEvents.map((event) => ({
      id: event.id,
      type: event.type,
      name: event.name,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      submissionDeadline: event.submissionDeadline,
      status: event.status,
      participantCount: event._count.participants,
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
    const events = await prisma.event.findMany({
      include: {
        participants: true,
        _count: { select: { checkedInParticipants: true } },
        teams: true,
        createdBy: true,
      },
    });
    const sortedEvents = sortEvents(events) as Event2[];
    const filledEvents = await Promise.all(
      sortedEvents.map((event) => {
        const users = event.participants;
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
          contactFirstName: user.contactFirstName,
          contactLastName: user.contactLastName,
          contactRelationship: user.contactRelationship,
          contactPhoneNumber: user.contactPhoneNumber,
          createdAt: user.createdAt,
        }));
        return {
          id: event.id,
          type: event.type,
          name: event.name,
          description: event.description,
          location: event.location,
          startDate: event.startDate,
          endDate: event.endDate,
          submissionDeadline: event.submissionDeadline,
          status: event.status,
          participants: removedUneccesaryFieldsUsers,
          checkedInParticipants: event._count.checkedInParticipants,
          teams: event.teams,
          createdBy: event.createdBy,
          createdAt: event.createdAt,
        };
      }),
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

export const judgeGetAllEvents = async (req: any, res: any) => {
  // This isn't all of the events, just the ones that can be judged
  const user = req.user as User;

  if (user.accountType !== "judge") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        type: "hackathon",
        status: { not: "upcoming" },
        releasedJudging: false,
      },
      include: { _count: { select: { participants: true, projects: true } } },
    });
    const sortedEvents = sortEvents(events) as Event3[];
    const removedUneccessaryFieldsEvents = sortedEvents.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      submissionDeadline: event.submissionDeadline,
      status: event.status,
      releasedJudging: event.releasedJudging,
      participantCount: event._count.participants,
      projectCount: event._count.projects,
    }));
    return res.status(200).json({
      message: "Events loaded successfully",
      events: removedUneccessaryFieldsEvents,
    });
  } catch (error) {
    console.error("Error loading events for judge:", error);
    return res.status(500).json({ message: "Failed to load events" });
  }
};

export const getEventById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        participants: true,
        projects: true,
      },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isUserParticipant = event.participants.some(
      (participant) => participant.id === user.id,
    );
    let removedUneccesaryFieldsTeam = null;
    if (isUserParticipant) {
      const userTeam = await prisma.team.findFirst({
        where: { eventId: id, members: { some: { id: user.id } } },
        include: { members: true, project: true },
      });
      if (userTeam) {
        const removedUneccesaryFieldsUsers = userTeam.members.map(
          (member) => `${member.firstName} ${member.lastName}`,
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
    const projects = event.projects.map((project) => {
      if (!project.submittedAt) return null;
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotURL,
        videoURL: project.videoURL,
        demoURL: project.demoURL,
        ranking: event.releasedJudging ? project.ranking : null,
      };
    });

    return res.status(200).json({
      message: "Event loaded successfully",
      event: {
        id: event.id,
        type: event.type,
        name: event.name,
        description: event.description,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        submissionDeadline: event.submissionDeadline,
        status: event.status,
        participantCount: event.participants.length,
        team: removedUneccesaryFieldsTeam,
        projects: projects.filter((project) => project !== null),
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
      include: {
        participants: true,
        checkedInParticipants: true,
        teams: true,
        projects: {
          include: {
            team: { include: { members: true } },
            judgeFeedback: true,
          },
        },
        createdBy: true,
      },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const removedUneccesaryFieldsUsers = event.participants.map((user) => ({
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
      contactFirstName: user.contactFirstName,
      contactLastName: user.contactLastName,
      contactRelationship: user.contactRelationship,
      contactPhoneNumber: user.contactPhoneNumber,
      checkedIn: event.checkedInParticipants.some(
        (checkedInUser) => checkedInUser.id === user.id,
      ),
      createdAt: user.createdAt,
    }));
    const projects = event.projects.map((project) => {
      const members = project.team.members.map((member) => {
        return `${member.firstName} ${member.lastName}`;
      });
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotURL,
        videoURL: project.videoURL,
        demoURL: project.demoURL,
        team: members,
        judgeFeedback: project.judgeFeedback,
        ranking: project.ranking,
        submittedAt: project.submittedAt,
      };
    });
    let judgedProjects = 0;
    let totalFeedbacks = 0;
    let averageCreativityScore = 0;
    let averageFunctionalityScore = 0;
    let averageTechnicalityScore = 0;
    let averageInterfaceScore = 0;
    let averageScore = 0;
    for (const project of projects) {
      if (project.judgeFeedback.length > 0) {
        judgedProjects += 1;
      }
      for (const feedback of project.judgeFeedback) {
        totalFeedbacks += 1;
        averageCreativityScore += feedback.creativityScore;
        averageFunctionalityScore += feedback.functionalityScore;
        averageTechnicalityScore += feedback.technicalityScore;
        averageInterfaceScore += feedback.interfaceScore;
        averageScore += feedback.totalScore;
      }
    }

    const filledEvent = {
      id: event.id,
      type: event.type,
      name: event.name,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      submissionDeadline: event.submissionDeadline,
      status: event.status,
      participants: removedUneccesaryFieldsUsers,
      checkedInParticipants: event.checkedInParticipants.length,
      teams: event.teams,
      projects: projects,
      judgedProjects: judgedProjects,
      releasedJudging: event.releasedJudging,
      averageCreativityScore: totalFeedbacks
        ? averageCreativityScore / totalFeedbacks
        : 0,
      averageFunctionalityScore: totalFeedbacks
        ? averageFunctionalityScore / totalFeedbacks
        : 0,
      averageTechnicalityScore: totalFeedbacks
        ? averageTechnicalityScore / totalFeedbacks
        : 0,
      averageInterfaceScore: totalFeedbacks
        ? averageInterfaceScore / totalFeedbacks
        : 0,
      averageScore: totalFeedbacks ? averageScore / totalFeedbacks : 0,
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

export const organizerGetUserByEmail = async (req: any, res: any) => {
  const { email } = req.params as { email: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const removedUneccesaryFieldsUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return res.status(200).json({
      message: "User loaded successfully",
      user: removedUneccesaryFieldsUser,
    });
  } catch (error) {
    console.error("Error loading user by email for organizer:", error);
    return res.status(500).json({ message: "Failed to load user" });
  }
};

export const judgeGetEventById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "judge") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: { select: { participants: true } },
        projects: {
          include: {
            team: { include: { members: true } },
            judgeFeedback: true,
          },
        },
      },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.status === "upcoming") {
      return res.status(400).json({ message: "Event has not started yet" });
    }
    if (event.type !== "hackathon") {
      return res
        .status(400)
        .json({ message: "Judging not available for this event type" });
    }
    if (event.releasedJudging !== false) {
      return res.status(400).json({ message: "Judging not available" });
    }

    const projects = event.projects.map((project) => {
      if (!project.submittedAt) return null;
      const members = project.team.members.map((member) => {
        return `${member.firstName} ${member.lastName}`;
      });
      const judgeFeedback = project.judgeFeedback.some(
        (feedback) => feedback.judgeId === user.id,
      );
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotURL,
        videoURL: project.videoURL,
        demoURL: project.demoURL,
        team: members,
        judged: judgeFeedback,
        submittedAt: project.submittedAt,
      };
    });
    const filteredProjects = projects.filter((project) => project !== null);

    const removedUneccessaryFieldsEvent = {
      id: event.id,
      name: event.name,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      submissionDeadline: event.submissionDeadline,
      status: event.status,
      releasedJudging: event.releasedJudging,
      participantCount: event._count.participants,
      projects: filteredProjects,
    };
    return res.status(200).json({
      message: "Event loaded successfully",
      event: removedUneccessaryFieldsEvent,
    });
  } catch (error) {
    console.error("Error loading event for judge:", error);
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

    await prisma.event.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Failed to delete event" });
  }
};
