import { endpoints } from "./endpoints";
import fetch from "./fetch"
import { getStringSchedule } from "./utils";


export async function getCalendar(schedule, token) {
    const filter ={ where: {schedule: schedule}}
    let response = await fetch(endpoints.user_calendar_get+'?filter=' + JSON.stringify(filter), "GET", null, null, token);
    if(response.length !== 0) {
        return response[0].id;
    }
    else {
        const calendarData = {
            name:getStringSchedule(schedule),
            schedule: schedule
        }
        let response = await fetch(endpoints.user_calendar_get, "POST", calendarData, null, token);
        return response.id;
    }
}
