import prisma from "../prisma/client";
import { User } from "@prisma/client";

export const handleHeartbeat = async (req: any, res: any) => {
  const { sessionId, deviceId } = req.cookies;
  const user = (req.user as User) || null;

  let session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    res.clearCookie("sessionId");
    return res.status(400).json({ error: "Invalid session" });
  }

  if (session && session.deviceId !== deviceId) {
    res.clearCookie("sessionId");
    return res.status(400).json({ error: "Invalid session" });
  }

  if (session && user && session.userId !== user.id) {
    res.clearCookie("sessionId");
    return res.status(400).json({ error: "Invalid session" });
  }

  if (
    session &&
    new Date().getTime() - new Date(session.sessionEnd).getTime() >
      5 * 60 * 1000
  ) {
    res.clearCookie("sessionId");
    return res.status(400).json({ error: "Invalid session" });
  }

  const newSessionEnd = new Date();
  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      sessionLength:
        new Date(newSessionEnd).getTime() -
        new Date(session.sessionStart).getTime(),
      sessionEnd: newSessionEnd,
    },
  });

  return res.status(200).json({ message: "Heartbeat received <3" });
};

export const getDayAnalytics = async (req: any, res: any) => {
  const { date } = req.query;
  const user = req.user as User;
  const dateObject = new Date(date);
  dateObject.setHours(0, 0, 0, 0);
  const endDateObject = new Date(dateObject);
  endDateObject.setHours(23, 59, 59, 999);

  if (user.accountType !== "organizer") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const dayPageViews = await prisma.pageView.findMany({
    where: {
      createdAt: {
        gte: dateObject,
        lt: endDateObject,
      },
    },
    include: {
      user: true,
    },
  });

  const userCleanedPageViews = dayPageViews.map((view) => ({
    ...view,
    user: {
      id: view.user?.id,
      firstName: view.user?.firstName,
      lastName: view.user?.lastName,
    },
  }));

  return res.status(200).json({
    message: `Day analytics for ${date} loaded successfully`,
    pageViews: userCleanedPageViews,
  });
};

export const getWeekAnalytics = async (req: any, res: any) => {
  const { startDate } = req.params;
  const user = req.user as User;
  const startDateObject = new Date(startDate);
  startDateObject.setHours(0, 0, 0, 0);
  const endDateObject = new Date(startDateObject);
  endDateObject.setDate(startDateObject.getDate() + 6);
  endDateObject.setHours(23, 59, 59, 999);

  if (user.accountType !== "organizer") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const weekPageViews = await prisma.pageView.findMany({
    where: {
      createdAt: {
        gte: startDateObject,
        lt: endDateObject,
      },
    },
    include: {
      user: true,
    },
  });

  const userCleanedPageViews = weekPageViews.map((view) => ({
    ...view,
    user: {
      id: view.user?.id,
      firstName: view.user?.firstName,
      lastName: view.user?.lastName,
    },
  }));

  return res.status(200).json({
    message: `Week analytics for ${startDate} loaded successfully`,
    pageViews: userCleanedPageViews,
  });
};

export const getCustomRangeAnalytics = async (req: any, res: any) => {
  const { startDate, endDate } = req.params;
  const user = req.user as User;
  const startDateObject = new Date(startDate);
  startDateObject.setHours(0, 0, 0, 0);
  const endDateObject = new Date(endDate);
  endDateObject.setHours(23, 59, 59, 999);

  if (user.accountType !== "organizer") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (startDateObject > endDateObject) {
    return res.status(400).json({ error: "Invalid date range" });
  }

  const customRangePageViews = await prisma.pageView.findMany({
    where: {
      createdAt: {
        gte: startDateObject,
        lt: endDateObject,
      },
    },
    include: {
      user: true,
    },
  });

  const userCleanedPageViews = customRangePageViews.map((view) => ({
    ...view,
    user: {
      id: view.user?.id,
      firstName: view.user?.firstName,
      lastName: view.user?.lastName,
    },
  }));

  return res.status(200).json({
    message: `Custom range analytics for ${startDate} to ${endDate} loaded successfully`,
    pageViews: userCleanedPageViews,
  });
};
