import { Workshop } from "@prisma/client";

const sortByStartDate = (workshops: Workshop[]) => {
  return workshops.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
};

const sortByEndDate = (workshops: Workshop[]) => {
  return workshops.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
};

export default function sortWorkshops(workshops: Workshop[]) {
  const upcomingWorkshops = workshops.filter(
    (workshop) => workshop.status === "upcoming"
  );
  const ongoingWorkshops = workshops.filter(
    (workshop) => workshop.status === "ongoing"
  );
  const completedWorkshops = workshops.filter(
    (workshop) => workshop.status === "completed"
  );

  return [
    ...sortByEndDate(ongoingWorkshops),
    ...sortByStartDate(upcomingWorkshops),
    ...sortByStartDate(completedWorkshops),
  ];
}
