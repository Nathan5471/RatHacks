import { AwsClient } from 'aws4fetch';
import fs from 'fs';
import path from 'path';
import prisma from '../prisma/client';

const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
}

const migrateUploadedFiles = async () => {
    const movedFiles: { [key: string]: string } = {}; // original filename -> new URL
    const previousUploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(previousUploadPath)) {
        return; // Skip if already migrated
    }
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const baseURL = process.env.R2_BASE_URL;
    const publicURL = process.env.R2_PUBLIC_BASE_URL;
    if (!accessKeyId || !secretAccessKey || !baseURL || !publicURL) {
        throw new Error('R2 credentials are not set in environment variables');
    }
    try {
        const r2 = new AwsClient({
            accessKeyId,
            secretAccessKey,
        })
        let updatedFileCount = 0;
        const files = fs.readdirSync(previousUploadPath);
        for (const file of files) {
            const filePath = path.join(previousUploadPath, file);
            const fileBuffer = fs.readFileSync(filePath);
            const newFilename = `user-upload-${Date.now()}.${path.extname(file)}`;
            const uploadURL = `${baseURL}/${newFilename}`;
            const finalURL = `${publicURL}/${newFilename}`;
            const response = await r2.fetch(uploadURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': mimeTypes[path.extname(file)],
                },
                body: fileBuffer,
            })
            if (!response.ok) {
                console.error(`Failed to upload ${file} to R2:`, await response.text());
                continue;
            }
            movedFiles[file] = finalURL;
            fs.unlinkSync(filePath);
            updatedFileCount++;
        }
        console.log(`Migrated ${updatedFileCount} files to R2`);
        let updatedProjectCount = 0;
        const projects = await prisma.project.findMany();
        for (const project of projects) {
            let updated = false;
            if (project.screenshotURL && !project.screenshotURL.startsWith(publicURL)) {
                const newURL = movedFiles[path.basename(project.screenshotURL)];
                if (newURL) {
                    await prisma.project.update({
                        where: { id: project.id },
                        data: { screenshotURL: newURL },
                    })
                    updated = true;
                }
            }
            if (project.videoURL && !project.videoURL.startsWith(publicURL)) {
                const newURL = movedFiles[path.basename(project.videoURL)];
                if (newURL) {
                    await prisma.project.update({
                        where: { id: project.id },
                        data: { videoURL: newURL },
                    })
                    updated = true;
                }
            }
            if (updated) {
                updatedProjectCount++;
            }
        }
        console.log(`Updated ${updatedProjectCount} project records with new file URLs`);
    } catch (error) {
        console.error('Error migrating uploaded files:', error);
    }
}

export default migrateUploadedFiles;