import { User } from "@prisma/client";
import path from "path";
import fs from "fs";
import generateBackup from "../utils/generateBackup";
import loadBackup from "../utils/loadBackup";

export const generate = async (req: any, res: any) => {
  const user = req.user as User;
  if (user.accountType != "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    await generateBackup();
    return res.status(200).json({ message: "Backup generated successfully" });
  } catch (error) {
    console.error(`Error generating backup: ${error}`);
    return res.status(500).json({ message: "Error generating backup" });
  }
};

export const load = async (req: any, res: any) => {
  const user = req.user as User;
  if (user.accountType != "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { backupName } = req.body as { backupName: string };
  const backupPath = path.join(process.cwd(), "backups", backupName);
  try {
    await loadBackup(backupPath);
    return res.status(200).json({ message: "Backup loaded successfully" });
  } catch (error) {
    console.error(`Error loading backup: ${error}`);
    return res.status(500).json({ message: "Error loading backup" });
  }
};

export const getAllBackups = async (req: any, res: any) => {
  const user = req.user as User;
  if (user.accountType != "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const backupDir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    return res.status(200).json({ backups: [] });
  }
  const backups = fs
    .readdirSync(backupDir)
    .filter((file) => file.endsWith(".dump"));
  backups.sort((a, b) => {
    const aTimestamp = a.split("-").slice(1, 6).join("-");
    const aParts = aTimestamp.split("-");
    const aTime = `${aParts[0]}-${aParts[1]}-${aParts[2]}:${aParts[3]}:${aParts[4].split(".")[0]}`;
    const bTimestamp = b.split("-").slice(1, 6).join("-");
    const bParts = bTimestamp.split("-");
    const bTime = `${bParts[0]}-${bParts[1]}-${bParts[2]}:${bParts[3]}:${bParts[4].split(".")[0]}`;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });
  return res.status(200).json({ backups });
};

export const getBackup = async (req: any, res: any) => {
  const user = req.user as User;
  if (user.accountType != "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { backupName } = req.params as { backupName: string };
  const backupPath = path.join(process.cwd(), "backups", backupName);
  if (!fs.existsSync(backupPath)) {
    return res.status(404).json({ message: "Backup not found" });
  }
  return res.download(backupPath, backupName);
};

export const deleteBackup = async (req: any, res: any) => {
  const user = req.user as User;
  if (user.accountType != "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const { backupName } = req.params as { backupName: string };
  const backupPath = path.join(process.cwd(), "backups", backupName);
  if (!fs.existsSync(backupPath)) {
    return res.status(404).json({ message: "Backup not found" });
  }
  fs.unlinkSync(backupPath);
  return res.status(200).json({ message: "Backup deleted successfully" });
};
