import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import initConnection from "./config/db";

import "dotenv/config";

const app = express();

initConnection(function () {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  const port = process.env.PORT || 3535;

  app.listen(port, () => {
    console.log(`[server]: Server running on port ${port}`);
  });
});
