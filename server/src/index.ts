import express from "express";
import "dotenv/config";
import passport from "passport";

import router from "./routes/routes";
import db from "./services/prisma";
import cookieParser from "cookie-parser";
import("./services/passport");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  require("express-session")({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

const port = process.env.PORT ?? 8000;

(async () => {
  await db.CheckDatabaseConnection();
  app.listen(port, () => {
    console.log(`Server is running at  http://localhost:${port}`);
  });
})();
