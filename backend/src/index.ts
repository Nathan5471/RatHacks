import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import eventRouter from "./routes/eventRouter";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const corsOptions = {
  origin: true,
  credentials: true,
}; // PLEASE REMEMBER TO CHANGE BEFORE RELEASING
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/event", eventRouter);

// SwaggerUI Docs
const swaggerDocument = YAML.load("./api-docs.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Frontend
app.use(express.static("public"));
app.use((req: any, res: any) => {
  res.sendFile("./public/index.html", { root: "." }, (error: any) => {
    if (error) {
      console.error("Error sending index file:", error);
      res.status(500).send("Page not found");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
