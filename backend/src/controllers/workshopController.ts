import { User } from "@prisma/client";
import prisma from "../prisma/client";
import sendWorkshopStartingEmail from "../utils/sendWorkshopStartingEmail";
import sortWorkshops from "../utils/sortWorkshops";
import type { Workshop1, Workshop2 } from "../utils/sortWorkshops";
import { marked } from "marked";
import sendCustomEmail from "../utils/sendCustomEmail";

export const createWorkshop = async (req: any, res: any) => {
  const { name, description, startDate, endDate } = req.body as {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const workshop = await prisma.workshop.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        organizerId: user.id,
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

export const joinWorkshop = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: { participants: true },
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    if (
      workshop.participants.some((participant) => participant.id === user.id)
    ) {
      return res.status(200).json({ message: "Already joined this workshop" });
    }

    await prisma.workshop.update({
      where: { id },
      data: { participants: { connect: { id: user.id } } },
    });

    res.status(200).json({ message: "Successfully joined the workshop" });

    const joinEmails = await prisma.email.findMany({
      where: {
        filterBy: "workshop",
        subFilterBy: workshop.id,
        sendOnJoin: true,
        active: true,
      },
      include: { sentTo: { select: { id: true, userId: true } } },
    });
    for (const email of joinEmails) {
      if (email.sentTo.some((sent) => sent.userId === user.id)) continue;
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
    console.error("Error joining workshop:", error);
    return res.status(500).json({ message: "Failed to join workshop" });
  }
};

export const leaveWorkshop = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: { participants: true },
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    if (
      !workshop.participants.some((participant) => participant.id === user.id)
    ) {
      return res
        .status(200)
        .json({ message: "You have not joined this workshop" });
    }

    await prisma.workshop.update({
      where: { id },
      data: {
        participants: { disconnect: { id: user.id } },
      },
    });

    return res.status(200).json({ message: "Successfully left the workshop" });
  } catch (error) {
    console.error("Error leaving workshop:", error);
    return res.status(500).json({ message: "Failed to leave workshop" });
  }
};

export const addGoogleMeetURL = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { googleMeetURL } = req.body as { googleMeetURL: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: { participants: true, organizer: true },
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (workshop.googleMeetURL !== null) {
      return res.status(400).json({ message: "Google Meet URL already set" });
    }

    await prisma.workshop.update({
      where: { id },
      data: { googleMeetURL, status: "ongoing" },
    });
    res.status(200).json({ message: "Google Meet URL added successfully" });

    // Send notification emails to participants (2 every second)
    const emailVerifiedParticipants = workshop.participants.filter(
      (participant) => participant.emailVerified === true,
    );

    const organizer = workshop.organizer;
    if (!organizer) return;
    const hasRatHacksEmail = organizer.email.endsWith("@rathacks.com") ?? false;
    emailVerifiedParticipants.forEach((participant, index) => {
      setTimeout(
        () => {
          sendWorkshopStartingEmail({
            senderName: `${organizer.firstName} ${organizer.lastName}`,
            emailName: hasRatHacksEmail
              ? organizer.firstName.toLowerCase()
              : "nathan",
            workshopName: workshop.name,
            email: participant.email,
            firstName: participant.firstName,
            meetingURL: googleMeetURL,
          });
        },
        (index / 2) * 1000,
      );
    });
  } catch (error) {
    console.error("Error adding Google Meet URL:", error);
    return res.status(500).json({ message: "Failed to add Google Meet URL" });
  }
};

export const endWorkshop = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id },
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (workshop.status !== "ongoing") {
      return res.status(400).json({ message: "Workshop is not ongoing" });
    }

    await prisma.workshop.update({
      where: { id },
      data: { status: "completed" },
    });
    return res.status(200).json({ message: "Workshop ended successfully" });
  } catch (error) {
    console.error("Error ending workshop:", error);
    return res.status(500).json({ message: "Failed to end workshop" });
  }
};

export const updateWorkshop = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { name, description, startDate, endDate } = req.body as {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id },
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    await prisma.workshop.update({
      where: { id },
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    return res.status(200).json({ message: "Workshop updated successfully" });
  } catch (error) {
    console.error("Error updating workshop:", error);
    return res.status(500).json({ message: "Failed to update workshop" });
  }
};

export const getAllWorkshops = async (req: any, res: any) => {
  try {
    const allWorkshops = await prisma.workshop.findMany({
      include: { _count: { select: { participants: true } }, organizer: true },
    });
    const sortedWorkshops = sortWorkshops(allWorkshops) as Workshop1[];
    const workshops = await Promise.all(
      sortedWorkshops.map(async (workshop) => {
        return {
          id: workshop.id,
          name: workshop.name,
          description: workshop.description,
          googleMeetURL: workshop.googleMeetURL,
          startDate: workshop.startDate,
          endDate: workshop.endDate,
          status: workshop.status,
          participantCount: workshop._count.participants,
          organizer:
            workshop.organizer !== null
              ? `${workshop.organizer.firstName} ${workshop.organizer.lastName}`
              : "Unknown Organizer",
        };
      }),
    );
    return res
      .status(200)
      .json({ message: "Workshops successfully loaded", workshops });
  } catch (error) {
    console.error("Error loading workshops:", error);
    return res.status(500).json({ message: "Failed to load workshops" });
  }
};

export const organizerGetAllWorkshops = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const allWorkshops = await prisma.workshop.findMany({
      include: {
        participants: true,
        organizer: true,
      },
    });
    const sortedWorkshops = sortWorkshops(allWorkshops) as Workshop2[];
    const workshops = await Promise.all(
      sortedWorkshops.map(async (workshop) => {
        const participants = await Promise.all(
          workshop.participants.map((participant) => {
            return {
              id: participant.id,
              email: participant.email,
              emailVerified: participant.emailVerified,
              accountType: participant.accountType,
              firstName: participant.firstName,
              lastName: participant.lastName,
              schoolDivision: participant.schoolDivision,
              gradeLevel: participant.gradeLevel,
              isGovSchool: participant.isGovSchool,
              techStack: participant.techStack,
              previousHackathon: participant.previousHackathon,
              parentFirstName: participant.parentFirstName,
              parentLastName: participant.parentLastName,
              parentEmail: participant.parentEmail,
              parentPhoneNumber: participant.parentPhoneNumber,
              contactFirstName: participant.contactFirstName,
              contactLastName: participant.contactLastName,
              contactRelationship: participant.contactRelationship,
              contactPhoneNumber: participant.contactPhoneNumber,
              createdAt: participant.createdAt,
            };
          }),
        );
        return {
          id: workshop.id,
          name: workshop.name,
          description: workshop.description,
          googleMeetURL: workshop.googleMeetURL,
          startDate: workshop.startDate,
          endDate: workshop.endDate,
          status: workshop.status,
          participants,
          organizer:
            workshop.organizer !== null
              ? `${workshop.organizer.firstName} ${workshop.organizer.lastName}`
              : "Unknown Organizer",
          organizerId: workshop.organizer,
          createdAt: workshop.createdAt,
        };
      }),
    );
    return res
      .status(200)
      .json({ message: "Workshops loaded successfully", workshops });
  } catch (error) {
    console.error("Error loading workshops for organizer:", error);
    return res.status(500).json({ message: "Failed to load workshops" });
  }
};

export const getWorkshopById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  try {
    const workshopData = await prisma.workshop.findUnique({
      where: { id },
      include: { _count: { select: { participants: true } }, organizer: true },
    });
    if (!workshopData) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const workshop = {
      id: workshopData.id,
      name: workshopData.name,
      description: workshopData.description,
      googleMeetURL: workshopData.googleMeetURL,
      startDate: workshopData.startDate,
      endDate: workshopData.endDate,
      status: workshopData.status,
      participantCount: workshopData._count.participants,
      organizer:
        workshopData.organizer !== null
          ? `${workshopData.organizer.firstName} ${workshopData.organizer.lastName}`
          : "Unknown Organizer",
      organizerId: workshopData.organizer,
      createdAt: workshopData.createdAt,
    };
    return res
      .status(200)
      .json({ message: "Workshop loaded successfully", workshop });
  } catch (error) {
    console.error("Error loading workshop:", error);
    return res.status(500).json({ message: "Failed to load workshop" });
  }
};

export const organizerGetWorkshopById = async (req: any, res: any) => {
  const user = req.user as User;
  const { id } = req.params as { id: string };

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const workshopData = await prisma.workshop.findUnique({
      where: { id },
      include: { participants: true, organizer: true },
    });
    if (!workshopData) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const participants = workshopData.participants.map(
      async (participantData) => {
        return {
          id: participantData.id,
          email: participantData.email,
          emailVerified: participantData.emailVerified,
          accountType: participantData.accountType,
          firstName: participantData.firstName,
          lastName: participantData.lastName,
          schoolDivision: participantData.schoolDivision,
          gradeLevel: participantData.gradeLevel,
          isGovSchool: participantData.isGovSchool,
          techStack: participantData.techStack,
          previousHackathon: participantData.previousHackathon,
          parentFirstName: participantData.parentFirstName,
          parentLastName: participantData.parentLastName,
          parentEmail: participantData.parentEmail,
          parentPhoneNumber: participantData.parentPhoneNumber,
          contactFIrstName: participantData.contactFirstName,
          contactLastName: participantData.contactLastName,
          contactRelationship: participantData.contactRelationship,
          contactPhoneNumber: participantData.contactPhoneNumber,
          createdAt: participantData.createdAt,
        };
      },
    );
    const filteredParticipants = participants.filter(
      (participant) => participant !== null,
    );

    const workshop = {
      id: workshopData.id,
      name: workshopData.name,
      description: workshopData.description,
      googleMeetURL: workshopData.googleMeetURL,
      startDate: workshopData.startDate,
      endDate: workshopData.endDate,
      status: workshopData.status,
      participants: filteredParticipants,
      organizer: workshopData.organizer
        ? `${workshopData.organizer.firstName} ${workshopData.organizer.lastName}`
        : "Unknown Organizer",
      createdAt: workshopData.createdAt,
    };
    return res
      .status(200)
      .json({ message: "Workshop loaded successfully", workshop });
  } catch (error) {
    console.error("Error loading workshop for organizer:", error);
    return res.status(500).json({ message: "Failed to load workshop" });
  }
};

export const deleteWorkshop = async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id },
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    await prisma.workshop.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Workshop deleted successfully" });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return res.status(500).json({ message: "Failed to delete workshop" });
  }
};
