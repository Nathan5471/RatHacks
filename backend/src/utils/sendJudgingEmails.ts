import prisma from "../prisma/client";
import sendPlacingEmail from "./sendPlacingEmail";
import sendFeedbackEmail from "./sendFeedbackEmail";

const sendJudgingEmails = async (eventId: string) => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  if (!FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined in environment variables");
  }
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) {
    throw new Error("Event not found");
  }
  const projects = await prisma.project.findMany({
    where: { eventId },
  });
  for (const [index, project] of projects.entries()) {
    const team = await prisma.team.findUnique({
      where: { id: project.teamId },
    });
    if (!team) {
      console.warn(
        `Team not found for project: ${project.name} (${project.id})`
      );
      continue;
    }
    const members = await Promise.all(
      team.members.map((memberId) => {
        return prisma.user.findUnique({ where: { id: memberId } });
      })
    );
    const filteredMembers = members.filter((member) => member !== null);
    if ([1, 2, 3].includes(project.ranking!)) {
      for (const member of filteredMembers) {
        if (!member.email) continue;
        setTimeout(async () => {
          // Send email with 1 team per second (up to 4/second)
          await sendPlacingEmail({
            firstName: member.firstName,
            ranking: project.ranking as 1 | 2 | 3,
            eventName: event.name,
            projectName: project.name,
            feedbackLink: `${FRONTEND_URL}/event/${event.id}/project/${project.id}`,
            email: member.email,
          });
        }, index * 1000);
      }
    } else {
      for (const member of filteredMembers) {
        if (!member.email) continue;
        setTimeout(async () => {
          await sendFeedbackEmail({
            firstName: member.firstName,
            eventName: event.name,
            projectName: project.name,
            feedbackLink: `${FRONTEND_URL}/event/${event.id}/project/${project.id}`,
            email: member.email,
          });
        }, index * 1000);
      }
    }
  }
};

export default sendJudgingEmails;
