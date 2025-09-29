import { Event } from "@prisma/client";

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
    (event) => event.status === "completed"
  );

  return [
    ...sortByEndDate(ongoingEvents),
    ...sortByStartDate(upcomingEvents),
    ...sortByStartDate(completedEvents),
  ];
}
