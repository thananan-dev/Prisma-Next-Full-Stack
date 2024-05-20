import express, { Request, Response } from "express";
import router from "./routes/routes";
import db from "./services/prisma";

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT ?? 8000;

(async () => {
  await db.CheckDatabaseConnection();
  app.listen(port, () => {
    console.log(`Server is running at  http://localhost:${port}`);
  });
})();
