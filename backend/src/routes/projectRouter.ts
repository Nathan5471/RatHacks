import express from "express";
import {
  createProject,
  submitProject,
  leaveFeedback,
  updateProject,
  generateUploadLink,
  getProjectById,
  organizerGetProjectById,
  judgeGetProjectById,
} from "../controllers/projectController";
import authenticate from "../middleware/authenticate";
import nonRequiredAuthenticate from "../middleware/nonRequiredAuthenticate";

const router = express.Router();

router.post(
  "/create",
  authenticate,
  async (req: any, res: any) => {
    const { name, description, eventId } = req.body as {
      name: string;
      description: string;
      codeURL: string | null;
      demoURL: string | null;
      screenshotURL: string | null;
      videoURL: string | null;
      eventId: string;
    };

    if (!name || !description || !eventId) {
      return res
        .status(400)
        .json({ message: "Name, description, and event ID are required" });
    }

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
  async (req: any, res: any) => {
    const { projectId } = req.params as { projectId: string };
    const { name, description } = req.body as {
      name: string;
      description: string;
      codeURL: string | null;
      demoURL: string | null;
      screenshotURL: string | null;
      videoURL: string | null;
    };

    if (!projectId || !name || !description) {
      return res
        .status(400)
        .json({ message: "Project ID, Name, and Description are required" });
    }

    await updateProject(req, res);
  }
);

router.get("/uploadLink/:fileExtension", authenticate, async (req: any, res: any) => {
  const { fileExtension } = req.params as { fileExtension: string };

  if (!fileExtension) {
    return res.status(400).json({ message: "File extension is required" });
  }

  if (!["png", "jpg", "jpeg", "webp", "mp4", "webm"].includes(fileExtension.toLowerCase())) {
    return res.status(400).json({ message: "Invalid file extension" });
  }

  await generateUploadLink(req, res);
});

router.get(
  "/get/:projectId",
  nonRequiredAuthenticate,
  async (req: any, res: any) => {
    const { projectId } = req.params as { projectId: string };

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    await getProjectById(req, res);
  }
);

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
