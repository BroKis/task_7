import express from "express";
import rootRouter from "./routers/rootRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const HOST = "127.0.0.1";
const PORT = 8000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use("/api", rootRouter);

app.listen(PORT, HOST, () => console.log(`Server start at http://${HOST}:${PORT}`));