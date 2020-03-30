import { SET_CURRENT_USER, SET_CURRENT_USER_FAIL } from '../actions/types';
// import { isEmptyStatement } from "@babel/types";

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: true
}
export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthenticated: true,
                user: action.user,
                loading: false
            }
        case SET_CURRENT_USER_FAIL:
            return {
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.error
            }
        default:
            return state;
    }
}