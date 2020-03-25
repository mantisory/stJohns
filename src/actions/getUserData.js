import dataMethods from "../utils/data";
import {GET_USER_DATA_BEGIN, GET_USER_DATA_SUCCESS, GET_ALL_USERS_SUCCESS, GET_AVAILABLE_SHIFTS,GET_AVAILABLE_SHIFTS_SUCCESS, GET_ALL_SHIFTS_FOR_DATE_SUCCESS,SAVE_USER_BATCH,SAVE_USER_BATCH_SUCCESS,SAVE_USER_SUCCESS, SAVE_USER_IS_ADMIN_SUCCESS, GET_ALL_SHIFTS_FOR_MONTH_SUCCESS, DELETE_USERS_SUCCESS} from './types'
import { format} from 'date-fns'
import { FormatListNumbered } from "@material-ui/icons";

function fetchUserData(currentDate, UID) {
  return dataMethods.getScheduledShifts(currentDate, UID);
}
function fetchAvailableShifts(){
    return dataMethods.getAllAvailableShifts();
}
function saveUserData(shifts, scheduledDate, locationID, UID){
    return dataMethods.saveShifts(shifts, scheduledDate, locationID, UID);
}
function deleteUserShift(shiftID){
    return dataMethods.deleteShift(shiftID);
}
function fetchAllUsers(){
    return dataMethods.getAllUsers();
}

function fetchAllShiftsForDate(currentDate){
    return dataMethods.getScheduledShiftsForDate(currentDate)
}

function fetchAllShiftsForMonth(currentDate){
    return dataMethods.getScheduledShiftsForMonth(currentDate)
}

function saveUser(user){
    user.isStaff = user.isStaff?1:0;
    user.isAdmin = user.isAdmin?1:0;
    user.location = parseInt(user.location)
    return dataMethods.userRegister(user);
}

function saveAllUsers(userList){
    return Promise.all(userList.map(user=>{
        saveUser(user)
    }));
}

function saveUserAdmin(userList){
    return dataMethods.saveUserAdmin(userList);
}
export function saveNewUser(user){
    return dispatch=>{
        return saveUser(user)
        .then(results=>{
            dispatch(saveUserSuccess(results.data))
        })
    }
}
export function saveUserBatch(userList){
    return dispatch=>{
        return saveAllUsers(userList)
        .then(results=>{
            dispatch(saveUserBatchSuccess(results.data))
        })
    }
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
function deleteUsersInList(userList){
    return dataMethods.deleteUsers(userList)
}
export function deleteUsers(userList){
    return dispatch => {
        return deleteUsersInList(userList)
            .then(results=>{
                dispatch(deleteUsersSuccess(results.data))
            })
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
export function getAvailableShifts(){
    return dispatch =>{
        return fetchAvailableShifts()
            .then(results=>{
                dispatch(getAvailableShiftsSuccess(results.data))
            })
    }
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
export function getAllShiftsForMonth(currentDate){
    return dispatch => {
        return fetchAllShiftsForMonth(currentDate)
        .then(results => {
            dispatch(getAllShiftsForMonthSuccess(results.data));
            return results.data;
        })
    }
}
export function removeUserShift(shiftID, UID){
    return dispatch => {
        return deleteUserShift(shiftID)
    }
}
export function saveUserShifts(shifts, scheduledDate,locationID, UID){
    return dispatch =>{
        return saveUserData(shifts,scheduledDate, locationID, UID)
    }
}


export const getUserDataBegin = () => ({
  type: GET_USER_DATA_BEGIN,
  loading:true
});

export function saveUserSuccess(data){
    return{
        type:SAVE_USER_SUCCESS,
        loading:false,
        userSaveSuccess:true
    }
}
export function saveUserBatchSuccess(data){
    return{
        type:SAVE_USER_BATCH_SUCCESS,
        loading:false,
        userBatchSaveSuccess:true
    }
}
export function saveUserIsAdminSuccess (data){
    return{
        type:SAVE_USER_IS_ADMIN_SUCCESS,
        loading:false,
        userSaveSuccess:true
    }
}
export function deleteUsersSuccess(data){
    return{
        type:DELETE_USERS_SUCCESS,
        loading:false,
        userDeleteSuccess:true
    }
}
export function getAllUsersSuccess(data){
    return {
        type:GET_ALL_USERS_SUCCESS,
        loading:false,
        users:[...data]
    }
}
export function getAllShiftsForMonthSuccess( data){
    return {
        type:GET_ALL_SHIFTS_FOR_MONTH_SUCCESS,
        loading:false,
        monthlyShifts:[...data.userData]
    }
}
export function getAllShiftsForDateSuccess ( data ) {
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
export function getAvailableShiftsSuccess(data){
    return{
        type:GET_AVAILABLE_SHIFTS_SUCCESS,
        loading:false,
        availableShifts:[...data]
    }
}
