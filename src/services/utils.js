import moment from 'moment';
import 'moment/locale/es.js';
moment.updateLocale('es')

function translateDay(day) {
    let translatedDay = ""
    switch (day) {
        case "Monday":  translatedDay = "Lunes";
            break;
        case "Tuesday":  translatedDay = "Martes";
            break;
        case "Wednesday":  translatedDay = "Miércoles";
            break;
        case "Thursday":  translatedDay = "Jueves";
            break;
        case "Friday":  translatedDay = "Viernes";
            break;
        case "Saturday":  translatedDay = "Sábado";
            break;
        case "Sunday":  translatedDay = "Domingo";
            break;
        default: translatedDay = "Lunes";
            break;
    }
    return translatedDay;
}

export function getTotalHoursInADay(hoursObjectsArray) {
    let totalHours = 0;
    hoursObjectsArray.map((hoursObjetc)=>{
        totalHours += hoursObjetc.number_hours;
    })
    return totalHours;
}

export function formatHour(value) {
    var hours = Math.floor(value);
    var minutes = Math.round((Math.abs(value) * 60) % 60);
    return hours.toString() + ":" + (minutes.toString().length === 1 ? "0" + minutes.toString() : minutes.toString())
}

export function formatHourString(value) {
    var hours = Math.floor(value);
    var minutes = value % 60;
    return hours.toString() + "h " + (minutes.toString().length === 1 ? minutes.toString() + "0" : minutes.toString())+"min"
}

export function contertToHourText(num) {
    
    var min = 1 / 60;
   
    // Separate the int from the decimal part
    var intpart = Math.floor(num);
    var decpart = num - intpart;
   
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);
   
    var minutes = Math.floor(decpart * 60);

    minutes = (minutes > 0) ? ' ' + minutes + 'm' : '';
   
    return intpart + 'h' + minutes;
}

export function contertToHourTime(time) {
    var hours, minutes;
    // Number of decimal places to round to
	var decimal_places = 2;

	// Maximum number of hours before we should assume minutes were intended. Set to 0 to remove the maximum.
	var maximum_hours = 15;

	// 3
	var int_format = time.match(/^\d+$/);

	// 1:15
	var time_format = time.match(/([\d]*):([\d]+)/);

	// 10m
	var minute_string_format = time.toLowerCase().match(/([\d]+)m/);

	// 2h
	var hour_string_format = time.toLowerCase().match(/([\d]+)h/);

	if (time_format != null) {
		hours = parseInt(time_format[1]);
		minutes = parseFloat(time_format[2]/60);
		time = hours + minutes;
	} else if (minute_string_format != null || hour_string_format != null) {
		if (hour_string_format != null) {
			hours = parseInt(hour_string_format[1]);
		} else {
			hours = 0;
		}
		if (minute_string_format != null) {
			minutes = parseFloat(minute_string_format[1]/60);
		} else {
			minutes = 0;
		}
		time = hours + minutes;
	} else if (int_format != null) {
		// Entries over 15 hours are likely intended to be minutes.
		time = parseInt(time);
		if (maximum_hours > 0 && time > maximum_hours) {
			time = (time/60).toFixed(decimal_places);
		}
	}

	// make sure what ever we return is a 2 digit float
    time = parseFloat(time).toFixed(decimal_places);
    
    time = parseFloat(time)

    return time;
    
} 

export function formatHourHourMinutes (value){
    var hour;
    if(isNaN(Number(value))) {
        hour = value;
    }else{
        hour = contertToHourText(value);
    }
    return hour;
}

export function formatHourNumber(value) {
    if(isNaN(Number(value))) {
        const number = value.split(":")
        return Math.round((Number(number[0]) + Number(number[1]/60) + Number.EPSILON) * 100) / 100
    }
    else return value
}

export function getTotalHours(item) {
    let scheduleHours = 0;
    if(item.calendar && item.calendar.length !== 0) item.calendar.map((item) => scheduleHours += item.hours)
    let totalHours= 0;
    if(item.hours[0].length !== 0) totalHours += getTotalHoursInADay(item.hours[0]);
    if(item.hours[1].length !== 0) totalHours += getTotalHoursInADay(item.hours[1]);
    if(item.hours[2].length !== 0) totalHours += getTotalHoursInADay(item.hours[2]);
    if(item.hours[3].length !== 0) totalHours += getTotalHoursInADay(item.hours[3]);
    if(item.hours[4].length !== 0) totalHours += getTotalHoursInADay(item.hours[4]);
    return {scheduleHours : scheduleHours , totalHours: totalHours}
}

export function getTotalHours2(item) {
    let totalHours= 0;
    if(item[0].length !== 0) totalHours += getTotalHoursInADay(item[0]);
    if(item[1].length !== 0) totalHours += getTotalHoursInADay(item[1]);
    if(item[2].length !== 0) totalHours += getTotalHoursInADay(item[2]);
    if(item[3].length !== 0) totalHours += getTotalHoursInADay(item[3]);
    if(item[4].length !== 0) totalHours += getTotalHoursInADay(item[4]);
    return totalHours
}

export function getWeekFormatted(value) {
    const thisWeek = moment().isoWeek()
    const selectedWeek = moment(value).isoWeek()

    if (thisWeek === selectedWeek) {
        return "Esta Semana";
    }
    else if (thisWeek - 1 === selectedWeek) {
        return "Semana pasada";
    }

    let day = moment(value).day() - 1

    if (day === -1) day = 6;

    let month = moment(value).subtract(day, 'days').format("MMMM")
    month = month.charAt(0).toUpperCase() + month.slice(1)

    let monthEnd = moment(value).add(6 - day, 'days').format('MMMM');
    monthEnd = monthEnd.charAt(0).toUpperCase() + monthEnd.slice(1);

    return moment(value).subtract(day, 'days').format("DD") + " " + month + " - " + moment(value).add(6 - day, 'days').format("DD") + " " + monthEnd
}

export function getWeeks() {
    const today = new Date()
    return [
        today,
        new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        new Date(today.getTime() - 2 * 7 * 24 * 60 * 60 * 1000),
        new Date(today.getTime() - 3 * 7 * 24 * 60 * 60 * 1000)
    ]
}

export function dateEqual(date1, date2) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}

export function getStringSchedule(userCalendar) {
    let scheduleHours = 0;
    let days =[]
    if(userCalendar && userCalendar.length !== 0) 
        userCalendar.map((userCalendar) => 
            {
                scheduleHours += userCalendar.hours
                days.push(translateDay(userCalendar.day) === "Miércoles" ? "X" : translateDay(userCalendar.day)[0])
            }
        )
    return days + " | " + scheduleHours + " h"
}


export function toHex(string) {
    var hash = 0;
    if (string.length === 0) return hash;
    for (var i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    var color = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}