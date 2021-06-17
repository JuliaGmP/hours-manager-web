import { endpoints } from "./endpoints";
import fetch from "./fetch"

export async function getClients(token) {
    let response = await fetch(endpoints.clients, "GET", null, null, token);
    return response;
}

export async function getClientName(clientId, token) {
    const filter = { fields: { name: true }}
    let response = await fetch(endpoints.clients + "/" + clientId +'?filter=' + JSON.stringify(filter), "GET", null, null, token);
    return response;
}

export async function getClient(clientID, token) {
    let response = await fetch(endpoints.clients +"/" + clientID, "GET", null, null, token);
    return response;
}

export async function addClient(clientData, token) {
    let response = await fetch(endpoints.clients, "POST", clientData, null, token);
    return response;
}

export async function deleteClient(clientID, token) {
    let response = await fetch(endpoints.clients + "/" + clientID, "delete", null, null, token);
    return response;
}

export async function editClient(clientID, clientData, token) {
    let response = await fetch(endpoints.clients + "/" + clientID, "PATCH", clientData, null, token);
    return response;
}


