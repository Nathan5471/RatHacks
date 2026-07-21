import prisma from "../prisma/client";

const removeUncheckedInUsers = async (eventId: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: true,
        checkedInParticipants: true,
        teams: {
          include: {
            members: true,
          },
        },
      },
    });
    if (!event) {
      throw new Error("Event not found");
    }
    if (event.status !== "completed") {
      throw new Error("Event is not completed");
    }
    for (const user of event.participants) {
      if (
        !event.checkedInParticipants.some(
          (checkedInUser) => checkedInUser.id === user.id,
        )
      ) {
        const team = event.teams.find((team) => team.members);
        if (team) {
          if (team.members.length === 1) {
            await prisma.team.delete({ where: { id: team.id } });
          } else {
            await prisma.team.update({
              where: { id: team.id },
              data: {
                members: { disconnect: { id: user.id } },
              },
            });
          }
        }
        await prisma.event.update({
          where: { id: eventId },
          data: {
            participants: { disconnect: { id: user.id } },
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
