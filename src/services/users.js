import { endpoints } from "./endpoints";
import fetch from "./fetch"

export async function getUsers(token) {
    const response = await fetch(endpoints.users, "GET", null, null, token)
    return response
}

export async function getUsersByTenantID(token) {
    const response = await fetch(endpoints.users, "GET", null, null, token)
    return response
}

export async function getUserCalendar(token, id) {
    let response = await fetch(endpoints.user_calendar_get + '/' + id, "GET", null, null, token);
    return response;
}

export async function getUserRole(idRole, token) {
    let response = await fetch(endpoints.roles + '/' + idRole, "GET", null, null, token);
    return response;
}

export async function addUser(userData, token) {
    let response = await fetch(endpoints.user_register, "POST", userData, null, token);
    return response;
}

export async function editUser(userId, userData, token) {
    let response = await fetch(endpoints.users + "/" + userId, "PATCH", userData, null, token);
    return response;
}

export async function deleteUser(userId, token) {
    let response = await fetch(endpoints.users + "/" + userId, "DELETE", null, null, token);
    return response;
}

export async function getUser(userId, token) {
    let response = await fetch(endpoints.users + "/" + userId, "GET", null, null, token);
    return response;
}

export async function getUserName(userId, token) {
    const filter = { fields: { name: true }}
    let response = await fetch(endpoints.users + "/" + userId +'?filter=' + JSON.stringify(filter), "GET", null, null, token);
    return response;
}

export async function resetUserPassword(userData, token) {
    let response = await fetch(endpoints.user_reset_password, "POST", userData, null, token);
    return response;
}



