import prisma from "../prisma/client";

const migrateToRelationsInDb = async () => {
  const users = await prisma.user.findMany();
  for (const user of users) {
    for (const eventId of user.eventIds) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            events: {
              connect: { id: eventId },
            },
          },
        });
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (event && event.checkedInIds.includes(user.id)) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              checkedInEvents: {
                connect: { id: eventId },
              },
            },
          });
        }
      } catch (error) {
        console.error(
          `Error connecting user ${user.id} to event ${eventId}:`,
          error,
        );
      }
    }
  }
  const teams = await prisma.team.findMany();
  for (const team of teams) {
    for (const memberId of team.memberIds) {
      try {
        await prisma.team.update({
          where: { id: team.id },
          data: {
            members: {
              connect: { id: memberId },
            },
          },
        });
      } catch (error) {
        console.error(
          `Error connecting team ${team.id} to member ${memberId}:`,
          error,
        );
      }
    }
  }
  const workshops = await prisma.workshop.findMany();
  for (const workshop of workshops) {
    for (const participantId of workshop.participantIds) {
      try {
        await prisma.workshop.update({
          where: { id: workshop.id },
          data: {
            participants: {
              connect: { id: participantId },
            },
          },
        });
      } catch (error) {
        console.error(
          `Error connecting workshop ${workshop.id} to participant ${participantId}:`,
          error,
        );
      }
    }
  }
  const emails = await prisma.email.findMany();
  for (const email of emails) {
    for (const sentToId of email.sentToIds) {
      const sentTime = email.sentTimes[email.sentToIds.indexOf(sentToId)];
      try {
        await prisma.emailReceipt.create({
          data: {
            emailId: email.id,
            userId: sentToId,
            sentAt: sentTime,
          },
        });
      } catch (error) {
        console.error(
          `Error creating email receipt for email ${email.id} and user ${sentToId}:`,
          error,
        );
      }
    }
  }
};

export default migrateToRelationsInDb;
