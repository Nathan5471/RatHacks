import express from "express";
import {
  createEvent,
  joinEvent,
  leaveEvent,
  joinTeam,
  leaveTeam,
  checkInUser,
  updateEvent,
  getAllEvents,
  organizerGetAllEvents,
  judgeGetAllEvents,
  getEventById,
  organizerGetEventById,
  organizerGetUserByEmail,
  judgeGetEventById,
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

router.post("/join/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  await joinEvent(req, res);
});

router.post("/leave/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Event ID is requried" });
  }

  await leaveEvent(req, res);
});

router.post(
  "/join-team/:eventId/:joinCode",
  authenticate,
  async (req: any, res: any) => {
    const { eventId, joinCode } = req.params as {
      eventId: string;
      joinCode: string;
    };

    if (!eventId || !joinCode) {
      return res
        .status(400)
        .json({ message: "Event ID and Join Code are required" });
    }

    await joinTeam(req, res);
  }
);

router.post(
  "/leave-team/:eventId",
  authenticate,
  async (req: any, res: any) => {
    const { eventId } = req.params as {
      eventId: string;
    };

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    await leaveTeam(req, res);
  }
);

router.post(
  "/check-in/:eventId/:userId",
  authenticate,
  async (req: any, res: any) => {
    const { eventId, userId } = req.params as {
      eventId: string;
      userId: string;
    };

    if (!eventId || !userId) {
      return res
        .status(400)
        .json({ message: "Event ID and User ID are required" });
    }

    await checkInUser(req, res);
  }
);

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

router.get("/judge-all", authenticate, judgeGetAllEvents);

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

// This is going in the event router instead of auth router since it will only be used in the context of checking in at an event
router.get(
  "/organizer-user-by-email/:email",
  authenticate,
  async (req: any, res: any) => {
    const { email } = req.params as { email: string };

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await organizerGetUserByEmail(req, res);
  }
);

router.get("/judge/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  await judgeGetEventById(req, res);
});

router.delete("/delete/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  await deleteEvent(req, res);
});

export default router;
