import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import cors from "cors";

import initConnection from "./config/db";

import "dotenv/config";

import authRoutes from "./routes/auth";

const app = express();

initConnection(function () {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev", {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
  }));

  app.use("/api/v1/auth", authRoutes);

  const port = process.env.PORT || 3535;

  app.listen(port, () => {
    console.log(`[server]: Server running on port ${port}`);
  });
});
