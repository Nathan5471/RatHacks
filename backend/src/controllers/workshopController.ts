import { User } from "@prisma/client";
import prisma from "../prisma/client";

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
        organizer: user.id,
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
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    if (workshop.participants.includes(user.id)) {
      return res.status(200).json({ message: "Already joined this workshop" });
    }

    await prisma.workshop.update({
      where: { id },
      data: { participants: workshop.participants.concat([user.id]) },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { workshops: user.workshops.concat([workshop.id]) },
    });

    return res
      .status(200)
      .json({ message: "Successfully joined the workshop" });
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
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    if (!workshop.participants.includes(user.id)) {
      return res
        .status(200)
        .json({ message: "You have not joined this workshop" });
    }

    await prisma.workshop.update({
      where: { id },
      data: {
        participants: workshop.participants.filter(
          (participantId) => participantId !== user.id
        ),
      },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        workshops: user.workshops.filter(
          (workshopId) => workshopId !== workshop.id
        ),
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
    });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    if (workshop.googleMeetURL !== null) {
      return res.status(400).json({ message: "Google Meet URL already set" });
    }

    await prisma.workshop.update({
      where: { id },
      data: { googleMeetURL },
    });
    return res
      .status(200)
      .json({ message: "Google Meet URL added successfully" });
  } catch (error) {
    console.error("Error adding Google Meet URL:", error);
    return res.status(500).json({ message: "Failed to add Google Meet URL" });
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
    const allWorkshops = await prisma.workshop.findMany();
    const workshops = await Promise.all(
      allWorkshops.map(async (workshop) => {
        const organizer = await prisma.user.findUnique({
          where: { id: workshop.organizer },
        });
        return {
          id: workshop.id,
          name: workshop.name,
          description: workshop.description,
          googleMeetURL: workshop.googleMeetURL,
          startDate: workshop.startDate,
          endDate: workshop.endDate,
          participantCount: workshop.participants.length,
          organizer:
            organizer !== null
              ? `${organizer.firstName} ${organizer.lastName}`
              : "Unknown Organizer",
        };
      })
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
    const allWorkshops = await prisma.workshop.findMany();
    const workshops = await Promise.all(
      allWorkshops.map(async (workshop) => {
        const participants = await Promise.all(
          workshop.participants.map(async (participantId) => {
            const participant = await prisma.user.findUnique({
              where: { id: participantId },
            });
            return participant
              ? {
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
                  createdAt: participant.createdAt,
                }
              : null;
          })
        );
        const filteredParticipants = participants.filter(
          (participant) => participant !== null
        );
        const organizer = await prisma.user.findUnique({
          where: { id: workshop.organizer },
        });
        return {
          id: workshop.id,
          name: workshop.name,
          description: workshop.description,
          googleMeetURL: workshop.googleMeetURL,
          startDate: workshop.startDate,
          endDate: workshop.endDate,
          participants: filteredParticipants,
          organizer: organizer
            ? `${organizer.firstName} ${organizer.lastName}`
            : "Unknown Organizer",
          organizerId: workshop.organizer,
          createdAt: workshop.createdAt,
        };
      })
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
    });
    if (!workshopData) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const organizer = await prisma.user.findUnique({
      where: { id: workshopData.organizer },
    });

    const workshop = {
      id: workshopData.id,
      name: workshopData.name,
      description: workshopData.description,
      googleMeetURL: workshopData.googleMeetURL,
      startDate: workshopData.startDate,
      endDate: workshopData.endDate,
      participantCount: workshopData.participants.length,
      organizer: organizer
        ? `${organizer.firstName} ${organizer.lastName}`
        : "Unknown Organizer",
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
    });
    if (!workshopData) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const participants = await Promise.all(
      workshopData.participants.map(async (participantId) => {
        const participantData = await prisma.user.findUnique({
          where: { id: participantId },
        });
        if (participantData === null) {
          return null;
        }
        const participant = {
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
          createdAt: participantData.createdAt,
        };
        return participant;
      })
    );
    const filteredParticipants = participants.filter(
      (participant) => participant !== null
    );

    const organizer = await prisma.user.findUnique({
      where: { id: workshopData.organizer },
    });

    const workshop = {
      id: workshopData.id,
      name: workshopData.name,
      description: workshopData.description,
      googleMeetURL: workshopData.googleMeetURL,
      startDate: workshopData.startDate,
      endDate: workshopData.endDate,
      participants: filteredParticipants,
      organizer: organizer
        ? `${organizer.firstName} ${organizer.lastName}`
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

    await workshop.participants.forEach(async (participantId) => {
      const participant = await prisma.user.findUnique({
        where: { id: participantId },
      });
      if (!participant) return;
      await prisma.user.update({
        where: { id: participantId },
        data: {
          workshops: participant.workshops.filter(
            (workshopId) => workshopId !== workshop.id
          ),
        },
      });
    });
    await prisma.workshop.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Workshop deleted successfully" });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    return res.status(500).json({ message: "Failed to delete workshop" });
  }
};
