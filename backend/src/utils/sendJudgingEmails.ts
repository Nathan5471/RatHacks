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
    include: {
      projects: {
        include: {
          team: {
            include: {
              members: true,
            },
          },
        },
      },
    },
  });
  if (!event) {
    throw new Error("Event not found");
  }
  for (const [index, project] of event.projects.entries()) {
    if ([1, 2, 3].includes(project.ranking!)) {
      for (const member of project.team.members) {
        setTimeout(async () => {
          // Send email with 1 team per second (up to 4/second)
          await sendPlacingEmail({
            firstName: member.firstName,
            ranking: project.ranking as 1 | 2 | 3,
            eventName: event.name,
            projectName: project.name,
            feedbackLink: `${FRONTEND_URL}/app/project/${project.id}`,
            email: member.email,
          });
        }, index * 1000);
      }
    } else {
      for (const member of project.team.members) {
        setTimeout(async () => {
          await sendFeedbackEmail({
            firstName: member.firstName,
            eventName: event.name,
            projectName: project.name,
            feedbackLink: `${FRONTEND_URL}/app/project/${project.id}`,
            email: member.email,
          });
        }, index * 1000);
      }
    }
  }
};

export default sendJudgingEmails;
