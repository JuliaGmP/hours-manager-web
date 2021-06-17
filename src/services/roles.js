import { endpoints } from "./endpoints";
import fetch from "./fetch"

export async function getAllRoles(token) {
    const response = await fetch(endpoints.roles, 'GET', null, null, token)
    return response
}

export async function getRole(id, token) {
    const response = await fetch(endpoints.roles + "/" + id, 'GET', null, null, token)
    return response
}


