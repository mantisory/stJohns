import {combineReducers} from 'redux'
import auth from './Reducers/auth'
import shifts from "./Reducers/shifts";

export default combineReducers({
    shifts:shifts,
    auth:auth
})