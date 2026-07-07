import express from "express";
import nonRequiredAuthenticate from "../middleware/nonRequiredAuthenticate";

const router = express.Router();

router.post("/heartbeat", nonRequiredAuthenticate, async (req, res) => {
  const sessionId = req.cookies.sessionId;
  const deviceId = req.cookies.deviceId;

  if (!sessionId || !deviceId) {
    return res
      .status(400)
      .json({ error: "Session ID and Device ID are required" });
  }

  // Implement the stuff
});

export default router;
