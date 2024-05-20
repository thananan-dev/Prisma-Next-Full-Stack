import { Router } from "express";
import userController from "../controllers/user.controller";
const router = Router();

router.get("/users", userController.GetUsers);
router.get("/users/:id", userController.GetUserById);
router.post("/users", userController.CreateUser);
router.put("/users/:id", userController.UpdateUser);
router.delete("/users/:id", userController.DeleteUser);

export default router;
