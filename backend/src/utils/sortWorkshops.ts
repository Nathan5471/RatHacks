import { Prisma } from "@prisma/client";

export type Workshop1 = Prisma.WorkshopGetPayload<{
  include: {
    _count: { select: { participants: true } };
    organizer: true;
  };
}>;

export type Workshop2 = Prisma.WorkshopGetPayload<{
  include: {
    participants: true;
    organizer: true;
  };
}>;

type Workshop = Workshop1 | Workshop2;

const sortByStartDate = (workshops: Workshop[]) => {
  return workshops.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );
};

const sortByEndDate = (workshops: Workshop[]) => {
  return workshops.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
};

export default function sortWorkshops(workshops: Workshop[]) {
  const upcomingWorkshops = workshops.filter(
    (workshop) => workshop.status === "upcoming",
  );
  const ongoingWorkshops = workshops.filter(
    (workshop) => workshop.status === "ongoing",
  );
  const completedWorkshops = workshops.filter(
    (workshop) => workshop.status === "completed",
  );

  return [
    ...sortByEndDate(ongoingWorkshops),
    ...sortByStartDate(upcomingWorkshops),
    ...sortByStartDate(completedWorkshops),
  ];
}
