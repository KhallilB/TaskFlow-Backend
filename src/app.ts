import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth";
import projectRouter from "./routes/projects";
import taskRouter from "./routes/tasks";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  morgan("dev", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  })
);

app.use("/api/v1", [authRoutes, projectRouter, taskRouter]);

export default app;
