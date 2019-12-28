import dataMethods from "../utils/data";
import {GET_USER_DATA_BEGIN, GET_USER_DATA_SUCCESS} from './types'
import { format} from 'date-fns'

function fetchUserData(currentDate, UID) {
  return dataMethods.getScheduledShifts(currentDate, UID);
}
function saveUserData(shifts, UID){
    console.log('saveuserdata')
    return dataMethods.saveShifts(shifts, UID);
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
export function saveUserShifts(shifts, UID){
    // console.log('in save action')
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

export function getUserDataSuccess(data) {
  return {
    type: GET_USER_DATA_SUCCESS,
    loading:false,
    shifts: [...data.userData]
  };
}
