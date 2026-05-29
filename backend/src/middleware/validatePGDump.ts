import fs from "fs";

const validatePGDump = async (
  req: any,
  res: any,
  next: any
) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = req.file.path;

  try {
    const fileHandle = await fs.promises.open(filePath, "r");
    const buffer = Buffer.alloc(5);
    await fileHandle.read(buffer, 0, 5, 0);
    await fileHandle.close();
    if (buffer.toString("utf-8") !== "PGDMP") {
      await fs.promises.unlink(filePath);
      return res.status(400).json({
        error: "Only backup files are allowed",
      });
    }
    next();
  } catch (error) {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath).catch(() => {});
    }
    return res.status(500).json({ error: "Error validating backup file" });
  }
};

export default validatePGDump;