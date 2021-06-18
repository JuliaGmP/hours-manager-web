
const BASE_URL = "http://localhost:3000/";
const routes = {
    users: "/users",
    userCalendars: "/user-calendars",
    hours: "/hours",
    roles: "/roles",
    clients: "/clients",
    projects: "/projects",
    statusList: "/status",
    projectTypes: "/project-types"
};
export const endpoints = {
    //USERS CONTROLLER\\
    users: BASE_URL + routes.users, 
    users_get_by_tenant: BASE_URL + routes.users + "/usersByTenant", // + /{tenantId} 
    user_login: BASE_URL + routes.users + "/login", //post
    user_register: BASE_URL + routes.users + "/register", //post
    user_me: BASE_URL + routes.users + "/me", //get (shows current user(more info))
    user_me_user_profile: BASE_URL + routes.users + "/me/userProfile", //get
    user_calendar_get: BASE_URL + routes.userCalendars, // + /{id}
    user_reset_password: BASE_URL + routes.users + "/resetPassword", // + /{id}
    hours_getWeekHours: BASE_URL + routes.hours + "/HoursInAWeek", // + /{date}"
    hours_addHours: BASE_URL + routes.hours, // POST
    hours_get: BASE_URL + routes.hours, // + {id} GET

    //Charts
    hours_get_all_user_billable_hours_chart: BASE_URL + routes.hours + "/getUserBillableHoursChart", // + {tenantId} GET
    hours_get_total_billable_hours_chart: BASE_URL + routes.hours + "/getTotalBillableHoursChart", // + {tenantId} GET
    projects_gestor_chart: BASE_URL + routes.projects + "/gestorChart", // + {tenantID} GET
    projects_time_chart: BASE_URL + routes.projects + "/timeChart", // + {tenantID} GET

    roles: BASE_URL + routes.roles, // + {id} GET
    clients: BASE_URL + routes.clients, // + {id} GET
    projects: BASE_URL + routes.projects, // + {id} GET
    statusList: BASE_URL + routes.statusList, // GET
    projectTypes: BASE_URL + routes.projectTypes, // GET
};
