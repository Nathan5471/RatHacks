import { exec } from "child_process";
import fs from "fs";

const loadBackup = (backupPath: string) => {
    if (!fs.existsSync(backupPath)) {
        throw new Error("Backup file does not exist");
    }
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL is not defined");
    }
    const host = dbUrl.split("@")[1].split(":")[0];
    const user = dbUrl.split("@")[0].split("//")[1].split(":")[0];
    const password = dbUrl.split("@")[0].split("//")[1].split(":")[1];
    const table = dbUrl.split("/")[3];
    const command = `pg_restore -h ${host} -U ${user} -d ${table} -c --if-exists -1 ${backupPath}`;
    return new Promise((resolve, reject) => {
        exec(command, { env: { ...process.env, PGPASSWORD: password } }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error loading backup: ${error.message}`);
                reject(error);
            }

            if (stderr) {
                console.error(`Error loading backup: ${stderr}`);
            }

            console.log(`successfully loaded backup: ${backupPath}`);
            resolve(backupPath);
        })
    });
}

export default loadBackup;