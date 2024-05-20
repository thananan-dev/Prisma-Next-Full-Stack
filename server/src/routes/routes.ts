import { Router } from "express";
import helloWorld from "../controllers/helloWorldControllers";
const router = Router();

router.get("/helloWorld", helloWorld.GetHelloWorld);

export default router;
