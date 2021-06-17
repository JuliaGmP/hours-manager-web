import { UPDATE_USER } from "../types/userTypes";

const savedUser = localStorage.getItem("user");
const initialState = {
    user: savedUser ? JSON.parse(savedUser) : {}
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER:
            return {
                ...state,
                user: action.user
            };
        default:
            return state;
    }
};
