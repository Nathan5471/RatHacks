import express from "express";
import {
  createWorkshop,
  joinWorkshop,
  leaveWorkshop,
  updateWorkshop,
  getAllWorkshops,
  organizerGetAllWorkshops,
  getWorkshopById,
  organizerGetWorkshopById,
  deleteWorkshop,
} from "../controllers/workshopController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.post("/create", authenticate, async (req: any, res: any) => {
  const { name, description, startDate, endDate } = req.body as {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };

  if (!name || !description || !startDate || !endDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const now = new Date();
  if (now.getTime() > new Date(startDate).getTime()) {
    return res
      .status(400)
      .json({ message: "Start date should not be in the past" });
  }
  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    return res
      .status(400)
      .json({ message: "The end date must be after the start date" });
  }

  await createWorkshop(req, res);
});

router.post("/join/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }

  await joinWorkshop(req, res);
});

router.post("/leave/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }

  await leaveWorkshop(req, res);
});

router.put("/update/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { name, description, startDate, endDate } = req.body as {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };

  if (!id || !name || !description || !startDate || !endDate) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const now = new Date();
  if (now.getTime() > new Date(startDate).getTime()) {
    return res
      .status(400)
      .json({ message: "Start date should not be in the past" });
  }
  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    return res
      .status(400)
      .json({ message: "The end date must be after the start date" });
  }

  await updateWorkshop(req, res);
});

router.get("/all", authenticate, getAllWorkshops);

router.get("/organizer-all", authenticate, organizerGetAllWorkshops);

router.get("/get/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }

  await getWorkshopById(req, res);
});

router.get("/organizer/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }

  await organizerGetWorkshopById(req, res);
});

router.delete("/delete/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Workshop ID is required" });
  }

  await deleteWorkshop(req, res);
});

export default router;
