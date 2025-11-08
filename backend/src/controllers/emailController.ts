import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const createEmail = async (req: any, res: any) => {
  const { name, messageSubject, messageBody, sendAll, filterBy, subFilterBy } = req.body as {
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  

  try {
    const email = await prisma.email.create({
      data: {
        name,
        messageSubject,
        messageBody,
        sendAll,
        filterBy,
        subFilterBy,
      },
    });
    return res
      .status(201)
      .json({ message: "email created successfully", id: email.id });
  } catch (error) {
    console.error("Error creating email:", error);
    return res.status(500).json({ message: "Failed to create email" });
  }
};

// export const organizerGetAllEmails = async (req: any, res: any) => {
//   const user = req.user as User;

//   if (user.accountType !== "organizer") {
//     return res.status(403).json({ message: "Unauthorized" });
//   }

//   try {
//     const allEmails = await prisma.email.findMany();
//     // const sortedWorkshops = sortWorkshops(allWorkshops);
//     const emails = await Promise.all(
//       allEmails.map(async (workshop) => {
//         const participants = await Promise.all(
//           workshop.participants.map(async (participantId) => {
//             const participant = await prisma.user.findUnique({
//               where: { id: participantId },
//             });
//             return participant
//               ? {
//                   id: participant.id,
//                   email: participant.email,
//                   emailVerified: participant.emailVerified,
//                   accountType: participant.accountType,
//                   firstName: participant.firstName,
//                   lastName: participant.lastName,
//                   schoolDivision: participant.schoolDivision,
//                   gradeLevel: participant.gradeLevel,
//                   isGovSchool: participant.isGovSchool,
//                   techStack: participant.techStack,
//                   previousHackathon: participant.previousHackathon,
//                   parentFirstName: participant.parentFirstName,
//                   parentLastName: participant.parentLastName,
//                   parentEmail: participant.parentEmail,
//                   parentPhoneNumber: participant.parentPhoneNumber,
//                   contactFirstName: participant.contactFirstName,
//                   contactLastName: participant.contactLastName,
//                   contactRelationship: participant.contactRelationship,
//                   contactPhoneNumber: participant.contactPhoneNumber,
//                   createdAt: participant.createdAt,
//                 }
//               : null;
//           })
//         );
//         const filteredParticipants = participants.filter(
//           (participant) => participant !== null
//         );
//         const organizer = await prisma.user.findUnique({
//           where: { id: workshop.organizer },
//         });
//         return {
//           id: workshop.id,
//           name: workshop.name,
//           description: workshop.description,
//           googleMeetURL: workshop.googleMeetURL,
//           startDate: workshop.startDate,
//           endDate: workshop.endDate,
//           status: workshop.status,
//           participants: filteredParticipants,
//           organizer: organizer
//             ? `${organizer.firstName} ${organizer.lastName}`
//             : "Unknown Organizer",
//           organizerId: workshop.organizer,
//           createdAt: workshop.createdAt,
//         };
//       })
//     );
//     return res
//       .status(200)
//       .json({ message: "Workshops loaded successfully", emails });
//   } catch (error) {
//     console.error("Error loading workshops for organizer:", error);
//     return res.status(500).json({ message: "Failed to load workshops" });
//   }
// };