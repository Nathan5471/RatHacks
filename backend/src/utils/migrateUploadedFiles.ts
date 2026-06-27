import { AwsClient } from "aws4fetch";
import fs from "fs";
import { Readable } from "stream";
import path from "path";
import prisma from "../prisma/client";

const mimeTypes: { [key: string]: string } = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const migrateUploadedFiles = async () => {
  const previousUploadPath = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(previousUploadPath)) {
    return; // Skip if already migrated
  }
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const baseURL = process.env.R2_BASE_URL;
  const publicURL = process.env.R2_PUBLIC_BASE_URL;
  if (!accessKeyId || !secretAccessKey || !baseURL || !publicURL) {
    throw new Error("R2 credentials are not set in environment variables");
  }
  try {
    const r2 = new AwsClient({
      accessKeyId,
      secretAccessKey,
    });
    let updatedFileCount = 0;
    let updatedLinkCount = 0;
    let failedUploads = 0;
    const files = fs.readdirSync(previousUploadPath);
    for (const file of files) {
      const filePath = path.join(previousUploadPath, file);
      const fileStats = fs.statSync(filePath); // Need this for the file size
      const fileStream = fs.createReadStream(filePath);
      const webStream = Readable.toWeb(fileStream);
      const newFilename = `user-upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${path.extname(file)}`;
      const uploadURL = `${baseURL}/${newFilename}`;
      const finalURL = `${publicURL}/${newFilename}`;
      try {
        const response = await r2.fetch(uploadURL, {
          method: "PUT",
          headers: {
            "Content-Type":
              mimeTypes[path.extname(file)] || "application/octet-stream",
            "Content-Length": fileStats.size.toString(),
          },
          // I used 'as any' here because they have different TS definitions
          body: webStream as any,
        });
        if (!response.ok) {
          console.error(
            `Failed to upload ${file} to R2:`,
            await response.text(),
          );
          failedUploads++;
          continue;
        }
        fs.unlinkSync(filePath);
        updatedFileCount++;
        const screenshotUpdates = await prisma.project.updateMany({
          where: {
            OR: [
              { screenshotURL: file },
              { screenshotURL: { endsWith: `/${file}` } },
            ],
          },
          data: {
            screenshotURL: finalURL,
          },
        });
        const videoUpdates = await prisma.project.updateMany({
          where: {
            OR: [{ videoURL: file }, { videoURL: { endsWith: `/${file}` } }],
          },
          data: {
            videoURL: finalURL,
          },
        });
        updatedLinkCount += screenshotUpdates.count + videoUpdates.count;
      } catch (error) {
        console.error(`Error uploading ${file} to R2:`, error);
        failedUploads++;
      }
    }
    console.log(`Migrated ${updatedFileCount} files to R2`);
    console.log(`Updated ${updatedLinkCount} links in the database`);
    if (failedUploads === 0) {
      fs.rmdirSync(previousUploadPath);
      console.log(
        "All files uploaded successfully, removed the 'uploads' directory",
      );
    } else {
      console.warn(`There were ${failedUploads} failed uploads`);
    }
  } catch (error) {
    console.error("Error migrating uploaded files:", error);
  }
};

export default migrateUploadedFiles;
