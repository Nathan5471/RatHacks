import express from "express";
import {
  createEvent,
  updateEvent,
  getAllEvents,
  organizerGetAllEvents,
  getEventById,
  organizerGetEventById,
  deleteEvent,
} from "../controllers/eventController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/create", authenticate, async (req: any, res: any) => {
  const {
    name,
    description,
    location,
    startDate,
    endDate,
    submissionDeadline,
  } = req.body as {
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
  };

  if (
    !name ||
    !description ||
    !location ||
    !startDate ||
    !endDate ||
    !submissionDeadline
  ) {
    return res.status(400).json({
      message:
        "Name, description, location, start date, end date, and submission deadline are required",
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
    return res.status(400).json({
      message: "End date and submission deadline must be after the start date",
    });
  }

  await createEvent(req, res);
});

router.put("/update/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const {
    name,
    description,
    location,
    startDate,
    endDate,
    submissionDeadline,
  } = req.body as {
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    submissionDeadline: string;
  };

  if (
    !id ||
    !name ||
    !description ||
    !location ||
    !startDate ||
    !endDate ||
    !submissionDeadline
  ) {
    return res.status(400).json({
      message:
        "ID, name, description, location, start date, end date, and submission deadline are required",
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
    return res.status(400).json({
      message: "End date and submission deadline must be after the start date",
    });
  }

  await updateEvent(req, res);
});

router.get("/all", authenticate, getAllEvents);

router.get("/organizer-all", authenticate, organizerGetAllEvents);

router.get("/get/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  await getEventById(req, res);
});

router.get("/organizer/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  await organizerGetEventById(req, res);
});

router.delete("/delete/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  await deleteEvent(req, res);
});

export default router;
