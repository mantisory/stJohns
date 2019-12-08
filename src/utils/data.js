import axios from 'axios';
import Cookies from 'js-cookie'
const nodeServer = 'http://localhost:';
const nodePort = 5000;
let isAuth = false;
const dataMethods = {
    getScheduledShifts:(currentDate, UID)=>{
        console.log(UID)
        return axios.get(nodeServer+nodePort+'/getScheduledShiftsForUser?selectedDate='+currentDate+'&UID='+UID);
    },
    saveShifts:async(shifts, UID)=>{
        let shiftsSaved = shifts.map((shift)=>{
            if(shift.shiftID) {
                return axios.put(nodeServer+nodePort+'/updateShift?shiftID='+shift.shiftID+'&selectedDate='+shift.shiftDate + '&shiftValue='+shift.shiftValue).then((res)=>{
                    return res;
                })
            }else{
                axios.put(nodeServer+nodePort+'/addShift?UID='+UID+'&selectedDate='+shift.shiftDate + '&shiftValue='+shift.shiftValue).then((res)=>{
                    return res;
                })
            }
        });
        return Promise.all(shiftsSaved).then((res)=>{
            return 'success'
        })
    },
   
    userRegister:(payload)=>{
        return axios.post(nodeServer+nodePort+'/userRegister', payload);
    },
    emailValidate:(payload)=>{
        
        return axios.post(nodeServer+nodePort+'/emailValidate', payload);
    },
    setIsAuthenticated:val=>{
        isAuth = val;
    },
    isAuthenticated:()=>{
        const cookie = Cookies.get('stJohnsCookie');
        if(cookie){
           isAuth=true;
        }
        // isAuth=true;
        return isAuth;
    }
    // isAuthenticated:false
}

export default dataMethods;