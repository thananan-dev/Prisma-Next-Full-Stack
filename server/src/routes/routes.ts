import { Router } from "express";
import userController from "../controllers/user.controller";
import postController from "../controllers/post.controller";
import authenticationController from "../controllers/authentication.controller";
import { authenticate } from "../middleware/authenticate";
const router = Router();

router.get("/users", authenticate.JWT, userController.GetUsers);
router.get("/users/:id", authenticate.JWT, userController.GetUserById);
router.get(
  "/users/:id/posts",
  authenticate.JWT,
  userController.GetNestedPostsByUserId
);
router.post("/users", authenticate.JWT, userController.CreateUser);
router.put("/users/:id", authenticate.JWT, userController.UpdateUser);
router.delete("/users/:id", authenticate.JWT, userController.DeleteUser);

router.get("/posts", authenticate.JWT, postController.GetPosts);
router.get("/posts/:id", authenticate.JWT, postController.GetPostById);
router.post("/posts", authenticate.JWT, postController.CreatePost);
router.put("/posts/:id", authenticate.JWT, postController.UpdatePost);
router.delete("/posts/:id", authenticate.JWT, postController.DeletePost);

router.post("/login", authenticationController.Login);
router.post("/signup", authenticationController.SignUp);
router.get("/token", authenticationController.RefreshToken);

export default router;
