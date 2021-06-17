import { endpoints } from "./endpoints";
import fetch from "./fetch"

export async function login(email, password) {
    const credentials = { email, password };
    const response = await fetch(endpoints.user_login, "POST", credentials, null);
    return response;
}

export async function getUserProfile(token) {
    const response = await fetch(endpoints.user_me_user_profile, "GET", null, null, token);
    return response;
}

