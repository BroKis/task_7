import {database} from "../database/index.js";

export class UserController {
    static async addUser(req, res) {
        try {
            const user = req.body;
            const newUser = await database.addUser(user);
            res.status(201).send(newUser);
        } catch (e) {
            res.status(400).send(e.message);
        }
    }

    static async getUsers(req, res) {
        const users = await database.getUsers();
        res.send(users);
    }

    static async getProfile(req, res) {
        res.send(req.user);
    }

    static async deleteUser(req, res) {
        const id = +req.params.id;
        const deleted = await database.deleteUser(id);
        res.sendStatus(deleted ? 201 : 400);
    }
}