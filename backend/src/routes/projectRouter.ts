import express from "express";
import {
  createProject,
  updateProject,
  getProjectByEventId,
} from "../controllers/projectController";
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

router.put(
  "/update/:projectId",
  authenticate,
  upload.fields([
    { name: "screenshot", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  async (req: any, res: any) => {
    const { projectId } = req.params as { projectId: string };
    const { name, description, codeURL, demoURL } = req.body as {
      name: string;
      description: string;
      codeURL: string | null;
      demoURL: string | null;
    };
    if (!projectId || !name || !description) {
      return res
        .status(400)
        .json({ message: "Project ID, Name, and Description are required" });
    }

    req.screenshot = req.files?.screenshot
      ? req.files.screenshot[0].filename
      : null;
    req.video = req.files?.video ? req.files.video[0].filename : null;

    await updateProject(req, res);
  }
);

router.get("/get/:eventId", authenticate, async (req: any, res: any) => {
  const { eventId } = req.params as { eventId: string };

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  await getProjectByEventId(req, res);
});

export default router;
