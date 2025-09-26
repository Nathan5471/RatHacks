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

  const workshop = await prisma.workshop.create({
    data: { name, description, startDate, endDate, organizer: user.id },
  });
  res
    .status(201)
    .json({ message: "Workshop created successfully", id: workshop.id });
};

export const getAllWorkshops = async (req: any, res: any) => {
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
  res.status(200).json({ message: "Workshops succesfully loaded", workshops });
};

export const organizerGetAllWorkshops = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

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
        createdAt: workshop.createdAt,
      };
    })
  );
  res.status(200).json({ message: "Workshops loaded successfully", workshops });
};

export const getWorkshopById = async (req: any, res: any) => {
  const { id } = req.params as { id: string };

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
  res.status(200).json({ message: "Workshop loaded successfully", workshop });
};

export const organizerGetWorkshopById = async (req: any, res: any) => {
  const user = req.user as User;
  const { id } = req.params as { id: string };

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

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
  res.status(200).json({ message: "Workshop loaded successfully", workshop });
};
