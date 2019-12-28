import { combineReducers } from "redux";
import shifts from "./shifts";
import auth from "./auth"

export default combineReducers({
    shifts:shifts, 
    // auth:auth
});