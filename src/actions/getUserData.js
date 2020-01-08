import dataMethods from "../utils/data";
import {GET_USER_DATA_BEGIN, GET_USER_DATA_SUCCESS, GET_ALL_USERS, GET_ALL_USERS_SUCCESS, GET_ALL_SHIFTS_FOR_DATE, GET_ALL_SHIFTS_FOR_DATE_SUCCESS, SAVE_USER_IS_ADMIN, SAVE_USER_IS_ADMIN_SUCCESS} from './types'
import { format} from 'date-fns'

function fetchUserData(currentDate, UID) {
  return dataMethods.getScheduledShifts(currentDate, UID);
}
function saveUserData(shifts, UID){
    return dataMethods.saveShifts(shifts, UID);
}
function fetchAllUsers(){
    return dataMethods.getAllUsers();
}

function fetchAllShiftsForDate(currentDate){
    return dataMethods.getScheduledShiftsForDate(currentDate)
}

function saveUserAdmin(userList){
    return dataMethods.saveUserAdmin(userList);
}

export function saveUserIsAdmin(userList){
    return dispatch => {
        return saveUserAdmin(userList)
        .then(results => {
            dispatch(saveUserIsAdminSuccess(results.data));
            return results.data
        });
    }
}
export function getUserData(currentDate, UID) {
  return dispatch => {
      return fetchUserData(currentDate, UID)
        .then(results=>{
            dispatch(getUserDataSuccess(results.data))
             return results.data.userData;
        })
   
  };
}
export function getAllUsers(){
    return dispatch => {
        return fetchAllUsers()
        .then(results => {
            dispatch(getAllUsersSuccess(results.data));
            return results.data
        })
    }
}

export function getAllShiftsForDate(currentDate){
    return dispatch => {
        return fetchAllShiftsForDate(currentDate)
        .then(results => {
            dispatch(getAllShiftsForDateSuccess(results.data));
            return results.data;
        })
    }
}

export function saveUserShifts(shifts, UID){
    return dispatch =>{
        return saveUserData(shifts, UID)
            .then(results=>{
                dispatch(getUserData(format(new Date(),'yyyy-MM-d'),UID))

            })
    }
}


export const getUserDataBegin = () => ({
  type: GET_USER_DATA_BEGIN,
  loading:true
});

export function saveUserIsAdminSuccess (data){
    return{
        type:SAVE_USER_IS_ADMIN_SUCCESS,
        loading:false,
        userSaveSuccess:true
    }
}
export function getAllUsersSuccess(data){
    return {
        type:GET_ALL_USERS_SUCCESS,
        loading:false,
        users:[...data]
    }
}

export function getAllShiftsForDateSuccess ( data ) {
    // console.log(data)
    return{
    type:GET_ALL_SHIFTS_FOR_DATE_SUCCESS,
    loading:false,
    shifts:[...data.userData]
    }
}
export function getUserDataSuccess(data) {
  return {
    type: GET_USER_DATA_SUCCESS,
    loading:false,
    shifts: [...data.userData]
  };
}
