import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import migrateUploadedFiles from "./utils/migrateUploadedFiles";
import authRouter from "./routes/authRouter";
import eventRouter from "./routes/eventRouter";
import workshopRouter from "./routes/workshopRouter";
import projectRouter from "./routes/projectRouter";
import emailRouter from "./routes/emailRouter";
import backupRouter from "./routes/backupRouter";
import analyticsRouter from "./routes/analyticsRouter";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { createProxyMiddleware } from "http-proxy-middleware";
import "./schedulers/eventStatus";

dotenv.config();

const app = express();
let corsOptions = {};
if (process.env.IS_DEV) {
  corsOptions = {
    origin: true,
    credentials: true,
  }; // Finally got around to chaging this!
} else {
  corsOptions = {
    origin: "https://rathacks.com",
    credentials: true,
  };
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/event", eventRouter);
app.use("/api/workshop", workshopRouter);
app.use("/api/project", projectRouter);
app.use("/api/email", emailRouter);
app.use("/api/backup", backupRouter);
app.use("/api/analytics", analyticsRouter);

// SwaggerUI Docs
const swaggerDocument = YAML.load("./api-docs.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Frontend
if (process.env.IS_DEV) {
  app.use(
    "/",
    createProxyMiddleware({
      target: "http://localhost:5173",
      changeOrigin: true,
    }),
  );
} else {
  app.use(express.static("public"));

  app.use((req: any, res: any) => {
    res.sendFile("./public/index.html", { root: "." }, (error: any) => {
      if (error) {
        console.error("Error sending index.html:", error);

        res.status(500).send("Page not found");
      }
    });
  });
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");

  // Perform file migration
  migrateUploadedFiles().catch((error) => {
    console.error("Error during file migration:", error);
  });
});
