import mongoose from "mongoose";

const initConnection = (callback: Function) => {
  mongoose.connect(process.env.MONGO_URI!);
  let db = mongoose.connection;
  db.on("error", function (err) {
    console.log("Failed to connect to database");
    process.exit(1);
  });

  db.once("open", function () {
    console.log("Connected to database");
    callback();
  });
};

export default initConnection;