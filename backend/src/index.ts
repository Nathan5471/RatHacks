import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

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

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined");
}

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
