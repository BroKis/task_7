import {Router} from "express";
import {RepoController} from "../controllers/RepoController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const repoRouter = Router();

repoRouter.post("/repos", authMiddleware(), RepoController.addRepo);
repoRouter.put("/repos/:id",authMiddleware(['admin']),RepoController.updateRepo)
repoRouter.get("/repos/all", RepoController.getRepos);
repoRouter.get("/repos", authMiddleware(), RepoController.getReposByOwnerId);
repoRouter.delete("/repos/:id", authMiddleware(), RepoController.deleteRepo);

export default repoRouter;