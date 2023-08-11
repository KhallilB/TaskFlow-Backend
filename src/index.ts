import app from "./app";

import initConnection from "./config/db";

initConnection(function () {
  const port = process.env.PORT || 3535;

  app.listen(port, () => {
    console.log(`[server]: Server running on port ${port}`);
  });

  app.get("/", (req, res) => {
    res.send("server is running!");
  });
});

export default app;
