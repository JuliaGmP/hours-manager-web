import { endpoints } from "./endpoints";
import fetch from "./fetch"

export async function getAllTenants(token) {
    const response = await fetch(endpoints.tenants_get_all, 'GET', null, null, token)
    return response
}

export async function getTenant(token, id) {
    const response = await fetch(endpoints.tenants_get_all + "/"+ id, 'GET', null, null, token)
    return response
}

