import prisma from "../prisma/client";

const pageViewTracker = async (req: any, res: any, next: any) => {
  let sessionId = req.cookies.sessionId;
  let deviceId = req.cookies.deviceId;
  const user = req.user;

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
        operatingSystem: req.useragent.os,
        browser: req.useragent.browser,
        deviceType: req.useragent.isMobile ? "mobile" : "desktop",
        deviceId: deviceId ? deviceId : undefined,
        ip: req.ip,
      },
    });
    if (user) {
      await prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          userId: user.id,
        },
      });
    }
  }

  const pageView = await prisma.pageView.create({
    data: {
      url: req.originalUrl,
      sessionId: session.id,
    },
  });
  if (user) {
    await prisma.pageView.update({
      where: {
        id: pageView.id,
      },
      data: {
        userId: user.id,
      },
    });
  }
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

  req.cookie("sessionId", session.id, {
    httpOnly: true,
    sameSite: "strict",
  });
  res.cookie("deviceId", session.deviceId, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  next();
};

export default pageViewTracker;
