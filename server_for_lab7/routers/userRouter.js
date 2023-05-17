import {Router} from "express";
import {UserController} from "../controllers/UserController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.get("/users", authMiddleware(['admin']), UserController.getUsers);
userRouter.get("/profile", authMiddleware(), UserController.getProfile);
userRouter.post("/users", UserController.addUser);
userRouter.delete("/users/:id", authMiddleware(['admin']), UserController.deleteUser);

export default userRouter;