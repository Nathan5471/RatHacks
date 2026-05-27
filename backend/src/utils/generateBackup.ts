import { exec } from "child_process";
import path from "path";
import fs from "fs";

const generateBackup = () => {
    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(backupDir, `backup-${timestamp}.dump`);
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL is not defined");
    }
    const host = dbUrl.split("@")[1].split(":")[0];
    const user = dbUrl.split("@")[0].split("//")[1].split(":")[0];
    const password = dbUrl.split("@")[0].split("//")[1].split(":")[1];
    const table = dbUrl.split("/")[3];
    const command = `pg_dump -h ${host} -U ${user} -Fc -f ${backupFile} ${table}`;
    return new Promise((resolve, reject) => {
        exec(command, { env: { ...process.env, PGPASSWORD: password } }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating backup: ${error.message}`);
                reject(error);
            }

            if (stderr) {
                console.error(`Error generating backup: ${stderr}`);
            }

            console.log(`Backup generated successfully: ${backupFile}`);
            resolve(backupFile);
        })
    });
}