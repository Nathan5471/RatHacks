import express from "express";
import authenticate from "../middleware/authenticate";
import uploadBackup from "../middleware/uploadBackup";
import validatePGDump from "../middleware/validatePGDump";
import {
  generate,
  load,
  getAllBackups,
  getBackup,
  deleteBackup,
} from "../controllers/backupController";

const router = express.Router();

router.post("/generate", authenticate, async (req, res) => {
  await generate(req, res);
});

router.post("/load", authenticate, async (req, res) => {
  const { backupName } = req.body as { backupName: string };
  if (!backupName) {
    return res.status(400).json({ message: "Backup name is required" });
  }
  await load(req, res);
});

router.post(
  "/upload",
  authenticate,
  uploadBackup.single("backupFile"),
  validatePGDump,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({ message: "Backup uploaded successfully" });
  },
);

router.get("/backups", authenticate, async (req, res) => {
  await getAllBackups(req, res);
});

router.get("/:backupName", authenticate, async (req, res) => {
  const { backupName } = req.params as { backupName: string };
  if (!backupName) {
    return res.status(400).json({ message: "Backup name is required" });
  }
  await getBackup(req, res);
});

router.delete("/:backupName", authenticate, async (req, res) => {
  const { backupName } = req.params as { backupName: string };
  if (!backupName) {
    return res.status(400).json({ message: "Backup name is required" });
  }
  await deleteBackup(req, res);
});

export default router;
