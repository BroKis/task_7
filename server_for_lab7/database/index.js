import path from "path";
import fs from "fs/promises";
import {existsSync, appendFileSync} from "fs";
import bcrypt from "bcrypt";

const __dirname = path.resolve();

const usersPath = path.join(__dirname, "database", "users.json");
const reposPath = path.join(__dirname, "database", "repos.json");

if (!existsSync(usersPath)) appendFileSync(usersPath, "");
if (!existsSync(reposPath)) appendFileSync(reposPath, "");

class Database {
    static database = new Database();

    static getDatabase() {
        return Database.database;
    }

    constructor() {
    }

    async getUsers() {
        const users = await fs.readFile(usersPath, {encoding: "utf-8"}) || '[]';
        return JSON.parse(users);
    }

    async getUserById(id) {
        const users = await fs.readFile(usersPath, {encoding: "utf-8"}) || '[]';
        return JSON.parse(users).find(u => u.id === id);
    }

    async addUser(user) {
        const users = await this.getUsers();
        let id = Math.max(...users.map(user => user.id));
        id = id === -Infinity ? 1 : id + 1;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(user.password, salt);

        const newUser = {id, username: user.username.toLowerCase(), passwordHash};
        if (users.findIndex(u => u.username === newUser.username) !== -1)
            throw new Error(`${newUser.username} already exists`)

        await fs.writeFile(usersPath, JSON.stringify([...users, newUser], null, 2));

        return newUser;
    }

    async deleteUser(id) {
        const users = await this.getUsers();
        const filtered = users.filter(user => user.id !== id);
        if (users.length === filtered.length) return false;

        let repos = await this.getRepos();
        repos = repos.filter(r => r.ownerId !== id);

        await fs.writeFile(usersPath, JSON.stringify(filtered, null, 2));
        await fs.writeFile(reposPath, JSON.stringify(repos, null, 2));

        return true;
    }

    async setRefreshToken(id, token) {
        const users = await this.getUsers();
        const index = users.findIndex(user => user.id === id);

        users[index].refresh_token = token;

        await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
    }

    async addRepo(repo) {
        repo.name = repo.name.toLowerCase();
        const users = await this.getUsers();
        let repos = await this.getRepos();
        let id = Math.max(...repos.map(user => user.id));
        id = id === -Infinity ? 1 : id + 1;
        repo.id = id;
        const user = users.find(u => u.id === repo.ownerId);
        if (!user) throw new Error(`No such ownerId ${repo.ownerId}`);
        if (!repo.name) throw new Error("No name of repository");
        if (repos.find(r => r.name === repo.name && user.id === repo.ownerId)) throw new Error(`${user.username} already have repository '${repo.name}'`)

        await fs.writeFile(reposPath, JSON.stringify([...repos, {
            id,
            name: repo.name,
            ownerId: repo.ownerId
        }], null, 2));

        return repo;
    }

    async UpdateRepo(id,repo)
    {
        let repos = await this.getRepos();
        const filteredRepo = repos.filter(r => r.id == id);
        let name = repo.name;
        filteredRepo.name = name;

        if (!repo.name) throw new Error("No name of repository");
        if (repos.find(r => r.name === repo.name && user.id === repo.ownerId)) throw new Error(`${user.username} already have repository '${repo.name}'`)

        const filtered = repos.filter(r => r.id != id);

        await fs.writeFile(reposPath, JSON.stringify([...filtered, {
            id:filteredRepo.id,
            name: filteredRepo.name,
            ownerId: filteredRepo.ownerId
        }], null, 2));

        return true

    }

    async getRepos() {
        const repos = await fs.readFile(reposPath, {encoding: "utf-8"}) || '[]';
        return JSON.parse(repos);
    }

    async getReposByOwnerId(id) {
        const repos = await fs.readFile(reposPath, {encoding: "utf-8"}) || '[]';
        return JSON.parse(repos).filter(r => r.ownerId === id);
    }

    async deleteRepo(id) {
        const repos = await this.getRepos();
        const filtered = repos.filter(user => user.id !== id);
        if (repos.length === filtered.length) return false;

        await fs.writeFile(reposPath, JSON.stringify(filtered, null, 2));

        return true;
    }


}

export const database = Database.getDatabase();