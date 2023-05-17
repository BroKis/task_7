import {Router} from "express";
import repoRouter from "./repoRouter.js";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";

const root = Router();
root.use(repoRouter);
root.use(userRouter);
root.use(authRouter);

export default root;