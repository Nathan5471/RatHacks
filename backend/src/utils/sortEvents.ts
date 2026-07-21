import { Prisma } from "@prisma/client";

export type Event1 = Prisma.EventGetPayload<{
  include: {
    _count: { select: { participants: true } };
  };
}>;

export type Event2 = Prisma.EventGetPayload<{
  include: {
    participants: true;
    _count: { select: { checkedInParticipants: true } };
    teams: true;
    createdBy: true;
  };
}>;

export type Event3 = Prisma.EventGetPayload<{
  include: {
    _count: { select: { participants: true; projects: true } };
  };
}>;

type Event = Event1 | Event2 | Event3;

const sortByStartDate = (events: Event[]) => {
  return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

const sortByEndDate = (events: Event[]) => {
  return events.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
};

export default function sortEvents(events: Event[]) {
  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const ongoingEvents = events.filter((event) => event.status === "ongoing");
  const completedEvents = events.filter(
    (event) => event.status === "completed",
  );

  return [
    ...sortByEndDate(ongoingEvents),
    ...sortByStartDate(upcomingEvents),
    ...sortByStartDate(completedEvents),
  ];
}
