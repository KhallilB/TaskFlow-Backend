import mongoose from "mongoose";
import app from "./app";

const port = parseInt(process.env.PORT!) || 10000;
const host = "0.0.0.0";

mongoose.connect(process.env.MONGO_URI!.toString());

let db = mongoose.connection;

db.on("error", function (err) {
  console.error.bind(console, err);
  process.exit(1);
});

db.once("open", function () {
  console.log("Connected to database");
});

app.set("port", port);

app.listen(app.get("port"), host, () => {
  console.log(`[server]: Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("server is running!");
});