import cron from "node-cron";
import prisma from "../prisma/client";
import removeUncheckedInUsers from "../utils/removeUncheckedInUsers";

cron.schedule("* * * * *", async () => {
  // Runs every minute
  const now = new Date();
  let updateEvents = 0;
  try {
    const events = await prisma.event.findMany();
    const upcomingEvents = events.filter(
      (event) => event.status === "upcoming"
    );
    const ongoingEvents = events.filter((event) => event.status === "ongoing");

    for (const event of upcomingEvents) {
      if (now >= event.startDate) {
        await prisma.event.update({
          where: { id: event.id },
          data: { status: "ongoing" },
        });
        updateEvents++;
      }
    }
    for (const event of ongoingEvents) {
      const eventEndDate = new Date(
        Math.max(event.endDate.getTime(), event.submissionDeadline.getTime())
      );
      if (now >= eventEndDate) {
        await prisma.event.update({
          where: { id: event.id },
          data: { status: "completed" },
        });
        updateEvents++;
        await removeUncheckedInUsers(event.id);
      }
    }
    if (updateEvents > 0) {
      console.log(`Event statuses updated successfully: ${updateEvents}`);
    }
  } catch (error) {
    console.error("Error updating event statuses:", error);
  }
});
