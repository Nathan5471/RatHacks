import express from "express";
import {
  trackUrl,
  handleHeartbeat,
  getDayAnalytics,
  getWeekAnalytics,
  getCustomRangeAnalytics,
  getAllTimeAnalytics,
  loadSession,
  loadUserSessions,
  loadDeviceSessions,
} from "../controllers/analyticsController";
import nonRequiredAuthenticate from "../middleware/nonRequiredAuthenticate";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post(
  "/trackUrl",
  nonRequiredAuthenticate,
  async (req: any, res: any) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    await trackUrl(req, res);
  },
);

router.post(
  "/heartbeat",
  nonRequiredAuthenticate,
  async (req: any, res: any) => {
    const sessionId = req.cookies.sessionId;
    const deviceId = req.cookies.deviceId;

    if (!sessionId || !deviceId) {
      return res
        .status(400)
        .json({ error: "Session ID and Device ID are required" });
    }

    await handleHeartbeat(req, res);
  },
);

router.get("/day/:date", authenticate, async (req: any, res: any) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Please use yyyy-mm-dd." });
  }

  await getDayAnalytics(req, res);
});

router.get("/week/:startDate", authenticate, async (req: any, res: any) => {
  const { startDate } = req.params;

  if (!startDate) {
    return res.status(400).json({ error: "Start date is required" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Please use yyyy-mm-dd." });
  }

  await getWeekAnalytics(req, res);
});

router.get(
  "/custom/:startDate/:endDate",
  authenticate,
  async (req: any, res: any) => {
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start and end dates are required" });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return res
        .status(400)
        .json({ error: "Invalid start date format. Please use yyyy-mm-dd." });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return res
        .status(400)
        .json({ error: "Invalid end date format. Please use yyyy-mm-dd." });
    }

    await getCustomRangeAnalytics(req, res);
  },
);

router.get("/all", authenticate, getAllTimeAnalytics);

router.get("/session/:sessionId", authenticate, async (req: any, res: any) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  await loadSession(req, res);
});

router.get("/user/:userId", authenticate, async (req: any, res: any) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  await loadUserSessions(req, res);
});

router.get("/device/:deviceId", authenticate, async (req: any, res: any) => {
  const { deviceId } = req.params;

  if (!deviceId) {
    return res.status(400).json({ error: "Device ID is required" });
  }

  await loadDeviceSessions(req, res);
});

export default router;
