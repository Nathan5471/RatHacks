import prisma from "../prisma/client";
import { User } from "@prisma/client";

export const trackUrl = async (req: any, res: any) => {
  const { url } = req.body;
  const sessionId = (req.cookies.sessionId as string) || undefined;
  const deviceId = (req.cookies.deviceId as string) || undefined;
  const user = (req.user as User) || null;

  let session = null;

  if (sessionId) {
    session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (
      session &&
      new Date().getTime() - new Date(session.sessionEnd).getTime() >
        5 * 60 * 1000
    ) {
      session = null;
    }
    if (session && session.deviceId !== deviceId) {
      session = null;
    }
  }

  if (!session) {
    session = await prisma.session.create({
      data: {
        userId: user?.id,
        operatingSystem: req.useragent.os,
        browser: req.useragent.browser,
        deviceType: req.useragent.isMobile ? "mobile" : "desktop",
        deviceId: deviceId ? deviceId : undefined,
        ip: req.ip,
      },
    });
  }

  await prisma.pageView.create({
    data: {
      url: url,
      userId: user?.id,
      sessionId: session.id,
    },
  });

  const newSessionEnd = new Date();
  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      sessionLength:
        new Date(newSessionEnd).getTime() -
        new Date(session.sessionStart).getTime(),
      sessionEnd: newSessionEnd,
    },
  });

  res.cookie("sessionId", session.id, {
    httpOnly: true,
    sameSite: "strict",
  });
  res.cookie("deviceId", session.deviceId, {
    httpOnly: true,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "URL tracked successfully" });
};

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
  const { date } = req.params;
  const [year, month, day] = date.split("-").map(Number);
  const user = req.user as User;
  const dateObject = new Date(year, month - 1, day, 0, 0, 0, 0);
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

  const sortedPageViews = userCleanedPageViews.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return res.status(200).json({
    message: `Day analytics for ${date} loaded successfully`,
    pageViews: sortedPageViews,
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

  const sortedPageViews = userCleanedPageViews.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return res.status(200).json({
    message: `Week analytics for ${startDate} loaded successfully`,
    pageViews: sortedPageViews,
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

  const sortedPageViews = userCleanedPageViews.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return res.status(200).json({
    message: `Custom range analytics for ${startDate} to ${endDate} loaded successfully`,
    pageViews: sortedPageViews,
  });
};

export const getAllTimeAnalytics = async (req: any, res: any) => {
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const sessionStats = await prisma.session.aggregate({
    _count: {
      id: true,
    },
    _avg: {
      sessionLength: true,
    },
  });
  const pageViews = await prisma.pageView.aggregate({
    _count: {
      id: true,
    },
  });
  const pagesPerSession = pageViews._count.id / sessionStats._count.id;
  const last2Minutes = new Date();
  last2Minutes.setMinutes(last2Minutes.getMinutes() - 2);
  const activeUsers = await prisma.session.count({
    where: {
      sessionEnd: {
        gte: last2Minutes,
      },
    },
  });
  const deviceBreakdown = await prisma.session.groupBy({
    by: ["deviceType"],
    _count: {
      id: true,
    },
  });
  const osBreakdown = await prisma.session.groupBy({
    by: ["operatingSystem"],
    _count: {
      id: true,
    },
  });
  const browserBreakdown = await prisma.session.groupBy({
    by: ["browser"],
    _count: {
      id: true,
    },
  });

  const date30DaysAgo = new Date();
  date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
  const pageViews30Days = await prisma.pageView.findMany({
    where: {
      createdAt: {
        gte: date30DaysAgo,
      },
    },
  });
  const pageViewsPerDay: { [key: string]: number } = {};
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(date30DaysAgo);
    currentDate.setDate(currentDate.getDate() + i);
    pageViewsPerDay[currentDate.toISOString().split("T")[0]] = 0;
  }
  for (const view of pageViews30Days) {
    const viewDate = view.createdAt.toISOString().split("T")[0];
    pageViewsPerDay[viewDate] = (pageViewsPerDay[viewDate] || 0) + 1;
  }

  return res.status(200).json({
    message: "All time analytics loaded successfully",
    sessionStats,
    pageViews,
    pagesPerSession,
    activeUsers,
    deviceBreakdown,
    osBreakdown,
    browserBreakdown,
    pageViewsPerDay,
  });
};

export const loadSession = async (req: any, res: any) => {
  const { sessionId } = req.params;
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
      pageViews: true,
    },
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  const userCleanedSession = {
    ...session,
    user: {
      id: session.user?.id,
      email: session.user?.email,
      emailVerified: session.user?.emailVerified,
      accountType: session.user?.accountType,
      firstName: session.user?.firstName,
      lastName: session.user?.lastName,
      schoolDivision: session.user?.schoolDivision,
      gradeLevel: session.user?.gradeLevel,
      isGovSchool: session.user?.isGovSchool,
      techStack: session.user?.techStack,
      previousHackathon: session.user?.previousHackathon,
      parentFirstName: session.user?.parentFirstName,
      parentLastName: session.user?.parentLastName,
      parentEmail: session.user?.parentEmail,
      parentPhoneNumber: session.user?.parentPhoneNumber,
      contactFirstName: session.user?.contactFirstName,
      contactLastName: session.user?.contactLastName,
      contactRelationship: session.user?.contactRelationship,
      contactPhoneNumber: session.user?.contactPhoneNumber,
      createdAt: session.user?.createdAt,
    },
  };

  return res.status(200).json({
    message: "Session loaded successfully",
    session: userCleanedSession,
  });
};

export const loadUserSessions = async (req: any, res: any) => {
  const { userId } = req.params;
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!targetUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: true,
      pageViews: true,
    },
  });

  const userCleanedSessions = sessions.map((session) => ({
    ...session,
    user: {
      id: session.user?.id,
      email: session.user?.email,
      emailVerified: session.user?.emailVerified,
      accountType: session.user?.accountType,
      firstName: session.user?.firstName,
      lastName: session.user?.lastName,
      schoolDivision: session.user?.schoolDivision,
      gradeLevel: session.user?.gradeLevel,
      isGovSchool: session.user?.isGovSchool,
      techStack: session.user?.techStack,
      previousHackathon: session.user?.previousHackathon,
      parentFirstName: session.user?.parentFirstName,
      parentLastName: session.user?.parentLastName,
      parentEmail: session.user?.parentEmail,
      parentPhoneNumber: session.user?.parentPhoneNumber,
      contactFirstName: session.user?.contactFirstName,
      contactLastName: session.user?.contactLastName,
      contactRelationship: session.user?.contactRelationship,
      contactPhoneNumber: session.user?.contactPhoneNumber,
      createdAt: session.user?.createdAt,
    },
  }));

  return res.status(200).json({
    message: "User sessions loaded successfully",
    sessions: userCleanedSessions,
  });
};

export const loadDeviceSessions = async (req: any, res: any) => {
  const { deviceId } = req.params;
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const sessions = await prisma.session.findMany({
    where: {
      deviceId: deviceId,
    },
    include: {
      user: true,
      pageViews: true,
    },
  });

  const userCleanedSessions = sessions.map((session) => ({
    ...session,
    user: {
      id: session.user?.id,
      email: session.user?.email,
      emailVerified: session.user?.emailVerified,
      accountType: session.user?.accountType,
      firstName: session.user?.firstName,
      lastName: session.user?.lastName,
      schoolDivision: session.user?.schoolDivision,
      gradeLevel: session.user?.gradeLevel,
      isGovSchool: session.user?.isGovSchool,
      techStack: session.user?.techStack,
      previousHackathon: session.user?.previousHackathon,
      parentFirstName: session.user?.parentFirstName,
      parentLastName: session.user?.parentLastName,
      parentEmail: session.user?.parentEmail,
      parentPhoneNumber: session.user?.parentPhoneNumber,
      contactFirstName: session.user?.contactFirstName,
      contactLastName: session.user?.contactLastName,
      contactRelationship: session.user?.contactRelationship,
      contactPhoneNumber: session.user?.contactPhoneNumber,
      createdAt: session.user?.createdAt,
    },
  }));

  return res.status(200).json({
    message: "Device sessions loaded successfully",
    sessions: userCleanedSessions,
  });
};
