import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import router from "./routes/routes";

const app = express();
app.use(express.json());
app.use("/api", router);

const port = process.env.PORT ?? 8000;
app.listen(port, () => {
  console.log(`Server is running at  http://localhost:${port}`);
});
