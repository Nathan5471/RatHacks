import express from "express";
import {
  createProject,
  submitProject,
  leaveFeedback,
  updateProject,
  getProjectById,
  organizerGetProjectById,
  judgeGetProjectById,
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

router.post(
  "/feedback/:projectId",
  authenticate,
  async (req: any, res: any) => {
    const { projectId } = req.params as { projectId: string };
    const {
      creativityScore,
      functionalityScore,
      technicalityScore,
      interfaceScore,
      feedback,
    } = req.body as {
      creativityScore: number;
      functionalityScore: number;
      technicalityScore: number;
      interfaceScore: number;
      feedback: string;
    };

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    if (
      !creativityScore ||
      !functionalityScore ||
      !technicalityScore ||
      !interfaceScore ||
      !feedback
    ) {
      return res
        .status(400)
        .json({ message: "All scores and feedback are required" });
    }
    if (
      creativityScore < 1 ||
      creativityScore > 10 ||
      functionalityScore < 1 ||
      functionalityScore > 10 ||
      technicalityScore < 1 ||
      technicalityScore > 10 ||
      interfaceScore < 1 ||
      interfaceScore > 10
    ) {
      return res.status(400).json({ message: "Score is out of range: 1-10" });
    }

    await leaveFeedback(req, res);
  }
);

router.post("/submit/:projectId", authenticate, async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  await submitProject(req, res);
});

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

router.get("/get/:projectId", async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  await getProjectById(req, res);
});

router.get(
  "/organizer/:projectId",
  authenticate,
  async (req: any, res: any) => {
    const { projectId } = req.params as { projectId: string };

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    await organizerGetProjectById(req, res);
  }
);

router.get("/judge/:projectId", authenticate, async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };

  if (!projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  await judgeGetProjectById(req, res);
});

export default router;
