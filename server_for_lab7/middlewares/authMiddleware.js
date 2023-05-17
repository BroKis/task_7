import jwt from "jsonwebtoken";
import {config} from "../config.js";

export const authMiddleware = (roles = []) => (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')?.[1];
        const user = jwt.verify(token, config.ACCESS_SECRET);

        if (roles.length !== 0 && !roles.includes(user.role))
            return res.sendStatus(403);

        req.user = user;
        next();
    } catch (e) {
        res.sendStatus(401);
    }
}