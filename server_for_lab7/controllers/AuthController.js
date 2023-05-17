import {database} from "../database/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {config} from "../config.js";

export class AuthController {
    static async logIn(req, res) {
        let {username, password} = req.body;
        username = username.toLowerCase();

        const users = await database.getUsers();
        const user = users.find(u => u.username === username);
        if (!user) return res.status(400).send("No such user");

        const correspond = await bcrypt.compare(password, user.passwordHash);
        if (!correspond) return res.status(401).send("Wrong password");

        const refreshToken = jwt.sign({
            id: user.id,
            username: user.username
        }, config.REFRESH_SECRET, {expiresIn: 30 * 24 * 60 * 60 * 1000});
        const accessToken = jwt.sign({
            id: user.id,
            username: user.username
        }, config.ACCESS_SECRET, {expiresIn: "5 min"});

        await database.setRefreshToken(user.id, refreshToken);

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        }).send({access_token: accessToken});
    }

    static async refreshAccessToken(req, res) {
        try {
            const token = req.cookies.refresh_token;
            const user = jwt.verify(token, config.REFRESH_SECRET);

            const userDb = await database.getUserById(user.id);
            if (!userDb) return res.status(400).send("No such user");
            if (userDb.refresh_token !== token) return res.sendStatus(401);

            const accessToken = jwt.sign({
                id: user.id,
                username: user.username
            }, config.ACCESS_SECRET, {expiresIn: "5 min"});

            res.send({access_token: accessToken});
        } catch (e) {
            res.sendStatus(401);
        }
    }

    static async logout(req, res) {
        res.cookie("refresh_token", "").status(200).send();
    }
}