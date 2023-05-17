import {$api} from "../api/axios";

export class UserService {
    static async getProfile() {
        return $api.get("/profile");
    }
}