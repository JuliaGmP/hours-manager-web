import { UPDATE_USER } from "../types/userTypes";

export const updateUser = value => ({
    type: UPDATE_USER,
    user: value
});
