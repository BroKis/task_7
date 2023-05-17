import {$api} from "../api/axios";

export class RepoService {
    static async getRepos() {
        try {
            const response = await $api.get("/repos");
            return response.data;
        } catch (e) {
            return e.response.data;
        }
    }

    static async addRepo(name) {
        try {
            const response = await $api.post("/repos", {name});
            return response;
        } catch (e) {
            return e.response;
        }
    }

    static async deleteRepo(id) {
        try {
            const response = await $api.delete("/repos/${id}");
            return response.data;
        } catch (e) {
            return e.response.data;
        }
    }

    static async updateRepo(id,name){
        try
        {
            const response = await $api.put("/repos/${id}",{name});
            return response.data;
        }catch (e){
            return e.response.data;
        }

    }
}