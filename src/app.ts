import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth";
import "dotenv/config";

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

app.use("/api/v1/auth", authRoutes);

export default app;
