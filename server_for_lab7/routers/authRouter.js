import {Router} from "express";
import {AuthController} from "../controllers/AuthController.js";

const authRouter = Router();

authRouter.post("/login", AuthController.logIn);
authRouter.post("/refresh", AuthController.refreshAccessToken);
authRouter.post("/logout", AuthController.logout);
export default authRouter;