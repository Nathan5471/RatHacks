import express from "express";
import { createProject } from "../controllers/projectController";
import authenticate from "../middleware/authenticate";
import upload from "../middleware/upload";

const router = express.Router();

router.post(
  "/create",
  authenticate,
  upload.fields([
    { name: "screenshot", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req: any, res: any) => {
    const { name, description, codeURL, demoURL, eventId } = req.body as {
      name: string;
      description: string;
      codeURL: string | null;
      demoURL: string | null;
      eventId: string;
    };

    if (!name || !description || !eventId) {
      return res
        .status(400)
        .json({ message: "Name, description, and event ID are required" });
    }

    req.screenshot = req.files?.screenshot
      ? req.files.screenshot[0].filename
      : null;
    req.video = req.files?.video ? req.files.video[0].filename : null;

    await createProject(req, res);
  }
);

export default router;
