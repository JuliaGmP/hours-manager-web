import { endpoints } from "./endpoints";
import fetch from "./fetch"

export async function getProjects(clients, token, gestorId) {
    if(clients && clients.length !== 0){
        const tenantProjects = []
        for (const client of clients){
            let filter;
            if(gestorId)
                filter ={ where: {idClient: { like: client.id}, gestorId: { like: gestorId}}}
            else 
                filter ={ where: {idClient: { like: client.id}}}
            let response = await fetch(endpoints.projects+'?filter=' + JSON.stringify(filter), "GET", null, null, token);
            if(response.length !== 0) {
                response.map((project) => tenantProjects.push(project))
            }
        }
        return tenantProjects;
    } else {
        return []
    }
}


export async function getProjectName(projectId, token) {
    const filter = { fields: { name: true }}
    let response = await fetch(endpoints.projects + "/" + projectId +'?filter=' + JSON.stringify(filter), "GET", null, null, token);
    return response;
}

export async function getProjectBillableInfo(projectId, token) {
    const filter = { fields: { isBillable: true }}
    let response = await fetch(endpoints.projects + "/" + projectId +'?filter=' + JSON.stringify(filter), "GET", null, null, token);
    return response;
}

export async function getUserProjects(userID, token) {
    const filter ={ where: {userIDs : { inq: [userID]}}}
    let response = await fetch(endpoints.projects+'?filter=' + JSON.stringify(filter), "GET", null, null, token);
    return response
}

export async function addProject(projectData, token) {
    let response = await fetch(endpoints.projects, "POST", projectData, null, token);
    return response;
}

export async function editProject(idProject, projectData, token) {
    let response = await fetch(endpoints.projects + "/" + idProject, "PATCH", projectData, null, token);
    return response;
}


export async function getProjectHours(idProject, token) {
    let totalHours = 0;
    const filter ={ where: {idProject : { like: idProject}}}
    let responseHours = await fetch(endpoints.hours_get + '?filter=' + JSON.stringify(filter), "GET", null, null, token);
    if(responseHours && responseHours.length !== 0){
        for (const hours of responseHours){
            totalHours += hours.number_hours;
        }
    }
    return totalHours;
}

export async function getProject(idProject, token) {
    let response = await fetch(endpoints.projects +"/" + idProject, "GET", null, null, token);
    return response;
}

export async function deleteProject(idProject, token) {
    let response = await fetch(endpoints.projects +"/" + idProject, "delete", null, null, token);
    return response;
}

export async function deleteClientProjects(idClient, token) {
    const filter ={ where: {idClient: { like: idClient}}}
    let responseProjects = await fetch(endpoints.projects +'?filter=' + JSON.stringify(filter), "get", null, null, token);
    if(responseProjects && responseProjects.length !== 0){
        for (const project of responseProjects){
            await fetch(endpoints.projects + "/" + project.id, "delete", null, null, token);
        }
    }
}

export async function getStatusList() {
    let response = await fetch(endpoints.statusList +"/" , "GET", null, null);
    return response;
}

export async function getStatus(statusId) {
    let response = await fetch(endpoints.statusList +"/"+statusId  , "GET", null, null);
    return response;
}

export async function getProjectTypeList() {
    let response = await fetch(endpoints.projectTypes +"/" , "GET", null, null);
    console.log(response)
    return response;
}

export async function getGestorChart(tenantId, token) {
    let response = await fetch(endpoints.projects_gestor_chart + "/" + tenantId, "get", null, null, token);
    return response;
}

export async function getTimeChart(tenantId, token) {
    let response = await fetch(endpoints.projects_time_chart + "/" + tenantId, "get", null, null, token);
    return response;
}
