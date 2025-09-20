import express from "express";
import { createEvent } from "../controllers/eventController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/create", authenticate, async (req: any, res: any) => {
  const { name, description, startDate, endDate, submissionDeadline } =
    req.body as {
      name: string;
      description: string;
      startDate: string;
      endDate: string;
      submissionDeadline: string;
    };

  if (!name || !description || !startDate || !endDate || !submissionDeadline) {
    return res.status(400).json({
      message:
        "Name, description, start date, end date, and submission deadline are required",
    });
  }
  const now = new Date();
  if (now.getTime() > new Date(startDate).getTime()) {
    return res
      .status(400)
      .json({ message: "Start date should not be in the past" });
  }
  if (
    new Date(startDate).getTime() > new Date(endDate).getTime() ||
    new Date(startDate).getTime() > new Date(submissionDeadline).getTime()
  ) {
    return res
      .status(400)
      .json({ message: "End date and submission deadline must be after " });
  }

  await createEvent(req, res);
});

export default router;
