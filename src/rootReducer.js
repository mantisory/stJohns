import {combineReducers} from 'redux'
import auth from './Reducers/auth'
import shifts from "./Reducers/shifts";
import users from "./Reducers/users";

export default combineReducers({
    shifts:shifts,
    auth:auth,
    users:users
})