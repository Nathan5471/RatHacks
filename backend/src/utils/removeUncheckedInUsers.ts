import prisma from "../prisma/client";

const removeUncheckedInUsers = async (eventId: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.status !== "completed") {
      throw new Error("Event is not completed");
    }
    for (const userId of event.participants) {
      if (!event.checkedIn.includes(userId)) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              events: user.events.filter((id) => id !== eventId),
            },
          });
        }
        const team = await prisma.team.findFirst({
          where: {
            eventId: eventId,
            members: { has: userId },
          },
        });
        if (team) {
          if (team.members.length === 1) {
            await prisma.team.delete({ where: { id: team.id } });
            await prisma.event.update({
              where: { id: eventId },
              data: {
                teams: event.teams.filter((id) => id !== team.id),
              },
            });
          } else {
            await prisma.team.update({
              where: { id: team.id },
              data: {
                members: team.members.filter((id) => id !== userId),
              },
            });
          }
        }
        await prisma.event.update({
          where: { id: eventId },
          data: {
            participants: event.participants.filter((id) => id !== userId),
          },
        });
      }
    }
  } catch (error) {
    console.error("Error removing unchecked in users:", error);
    throw new Error("Failed to remove unchecked in users");
  }
};

export default removeUncheckedInUsers;
