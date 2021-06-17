import { endpoints } from "./endpoints";
import customFetch from "./fetch";
import moment from 'moment';

export async function getHoursInAWeek(token, date, userId) {
    const day = new Date(date)
    let response = await customFetch(endpoints.hours_getWeekHours + "/" + day + "/" + userId, "GET", null, null, token);
    return response;
}

export async function getHoursInARangeOfDays(token, startDate, endDate, userId) {
    let filter = 
    {where: 
        {userId: userId, 
        and : [
          {date:{ gte : startDate}},
          {date:{ lte : endDate}}
        ]
      }}
      console.log(filter)
    let response = await customFetch(endpoints.hours_get +'?filter=' + JSON.stringify(filter), "GET", null, null, token);
    return response;
}


export async function addHours(userId,date,number_hours,idProject, token) {
    const dateMoment = moment(date)
    dateMoment.set({hour:12,minute:0,second:0,millisecond:0})
    const data = {
        "userId": userId,
        "date": dateMoment,
        "number_hours": number_hours,
        "idProject": idProject,
      }
    let response = await customFetch(endpoints.hours_addHours, "POST", data, null, token);
    return response;
}

export async function deleteHours(hoursId, token) {
    let response = await customFetch(endpoints.hours_get + "/" + hoursId, "delete", null, null, token);
    return response;
}

export async function deleteUserHours(userId, token) {
    const filter ={ where: {userId: { like: userId}}}
    let responseHours = await customFetch(endpoints.hours_get +'?filter=' + JSON.stringify(filter), "get", null, null, token);
    if(responseHours && responseHours.length !== 0){
        for (const hours of responseHours){
            await customFetch(endpoints.hours_get + "/" + hours.id, "delete", null, null, token);
        }
    }
}

export async function getUserHours(userId, token) {
    const filter ={ where: {userId: { like: userId}}}
    let responseHours = await customFetch(endpoints.hours_get +'?filter=' + JSON.stringify(filter), "get", null, null, token);
    return responseHours
}


export async function getUserProjectHours(userId, projectId, token) {
    const filter ={ where: {userId: { like: userId}, idProject: { like: projectId}}}
    let responseHours = await customFetch(endpoints.hours_get +'?filter=' + JSON.stringify(filter), "get", null, null, token);
    if(responseHours && responseHours.length !== 0){
        let totalUserHours = 0;
        for (const hours of responseHours){
            totalUserHours = totalUserHours + hours.number_hours;
        }
        return Math.round((totalUserHours + Number.EPSILON) * 100) / 100;
    } else {
        return 0
    }
}

export async function getTotalProjectHours(projectId, token) {
    const filter ={ where: {idProject: { like: projectId}}}
    let responseHours = await customFetch(endpoints.hours_get +'?filter=' + JSON.stringify(filter), "get", null, null, token);
    return responseHours;
}

export async function deleteProjectHours(idProject, token) {
    const filter ={ where: {idProject: { like: idProject}}}
    let responseHours = await customFetch(endpoints.hours_get +'?filter=' + JSON.stringify(filter), "get", null, null, token);
    if(responseHours && responseHours.length !== 0){
        for (const hours of responseHours){
            await customFetch(endpoints.hours_get + "/" + hours.id, "delete", null, null, token);
        }
    }
}

export async function getUserBillableHoursChart(tenantId, token) {
    let responseHours = await customFetch(endpoints.hours_get_all_user_billable_hours_chart + "/" + tenantId, "get", null, null, token);
    return responseHours;
}

export async function getTotalBillableHoursChart(tenantId, token) {
    let responseHours = await customFetch(endpoints.hours_get_total_billable_hours_chart + "/" + tenantId, "get", null, null, token);
    return responseHours;
}


