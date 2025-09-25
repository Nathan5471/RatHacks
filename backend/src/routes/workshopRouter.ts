import express from "express";
import { createWorkshop } from "../controllers/workshopController";
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

export default router;
