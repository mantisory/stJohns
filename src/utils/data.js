import axios from 'axios';
import Cookies from 'js-cookie'
const nodeServer = 'http://localhost:';
const nodePort = 5000;
let isAuth = false;
const dataMethods = {
    getScheduledShifts:(currentDate)=>{
        return axios.get(nodeServer+nodePort+'/getScheduledShifts?selectedDate='+currentDate);
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
    userLogin:async(payload)=>{
        return axios.post(nodeServer+nodePort+'/userLogin',payload).then((results)=>{
            let code;
            switch(results.data.code){
                case 200:
                    
                    isAuth = true;
                    Cookies.set("stJohnsCookie",JSON.stringify({token:results.data.authenticationToken, expiry:results.data.tokenExpiryDate, first_name:results.data.first_name, last_name:results.data.last_name}))
                    code = 200;
                    break;
              case 204:
                      console.log('whoops')
                      code = 204
                      break;
                      case "default":
                          console.log('default')
            }
            return code;
        
        });
    },
    userRegister:(payload)=>{
        return axios.post(nodeServer+nodePort+'/userRegister', payload);
    },
    emailValidate:(payload)=>{
        
        return axios.post(nodeServer+nodePort+'/emailValidate', payload);
    },
    
    isAuthenticated:()=>{
        const cookie = Cookies.get('stJohnsCookie');
        // console.log(cookie)
        if(cookie){
             isAuth=true;
        //     // cookie = JSON.parse(cookie);

        }
        return isAuth;
    }
    // isAuthenticated:false
}

export default dataMethods;