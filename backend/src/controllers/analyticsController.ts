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
