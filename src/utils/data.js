import axios from "axios";
import Cookies from "js-cookie";
const nodeServer = "http://localhost:";
const nodePort = 5000;

let isAuth = false;

const dataMethods = (function() {
    'use strict';
  return {
    checkValueExists: (valueName, value) => {
      return axios.get(
        // nodeServer + nodePort +
          "/api/checkValueExists?valueName=" +
          valueName +
          "&value=" +
          value
      );
    },

    getScheduledShifts: (currentDate, UID) => {
        console.log('in get scheduled shifts')
      return axios.get(
        // nodeServer +nodePort +
          "/api/getScheduledShiftsForUser?selectedDate=" +
          currentDate +
          "&UID=" +
          UID
      );
    },
    getScheduledShiftsForDate:currentDate => {
        return axios.get(
            // nodeServer +nodePort +
              "/api/getScheduledShiftsForDate?selectedDate=" +
              currentDate
          );
    },
    getScheduledShiftsForMonth:currentDate => {
        return axios.get(
              "/api/getScheduledShiftsForMonth?selectedDate=" +
              currentDate
          );
    },
    getScheduledShiftsForAllUsers: currentDate => {
      return axios.get(
        // nodeServer + nodePort +
          "/api/getScheduledShiftsForAllUsers?selectedDate=" +
          currentDate
      );
    },
    deleteShift: async(day, UID)=>{
        // console.log(day)
        const payload = {day:day, UID:UID}
        return axios.post("/api/deleteShift",payload)
    },
    saveShifts: async (shifts, UID) => {
      let shiftsSaved = shifts.map(shift => {
        if (shift.scheduled_shift_ID) {
          return axios
            .put(
            //   nodeServer +nodePort +
                "/api/updateShift?shiftID=" +
                shift.scheduled_shift_ID +
                "&selectedDate=" +
                shift.scheduled_date +
                "&shiftValue=" +
                shift.scheduled_shift
            )
            .then(res => {
              return res;
            });
        } else {
          axios
            .put(
            //   nodeServer +nodePort +
                "/api/addShift?UID=" +
                UID +
                "&selectedDate=" +
                shift.scheduled_date +
                "&shiftValue=" +
                shift.scheduled_shift
            )
            .then(res => {
              return res;
            });
        }
      });
      return Promise.all(shiftsSaved).then(res => {
        return "success";
      });
    },

    userRegister: payload => {
    //   return axios.post(nodeServer + nodePort + "/userRegister", payload);
      return axios.post("/api/userRegister", payload);
    },

    saveUserAdmin: userList => {
      let usersUpdated = userList.map(user=>{
        //   return axios.post(nodeServer + nodePort + "/updateUserAdmin",user).then(res=>res);
          return axios.post("/api/updateUserAdmin",user).then(res=>res);
      });
      return Promise.all(usersUpdated).then(res=>{
          return res;
      })
    },

    deleteUsers: userList => {
        let usersDeleted = userList.map(user=>{
            return axios.post("/api/deleteUser", user).then(res=>res);
            // return ""
        });
        return Promise.all(usersDeleted).then(res=>{
            return res;
        })
    },

    emailValidate: payload => {
      return axios.post("/api/emailValidate", payload);
    },

    setIsAuthenticated: val => {
      isAuth = val;
    },

    isAuthenticated: () => {
      const cookie = Cookies.get("stJohnsCookie");
      if (cookie) {
        isAuth = true;
      }

      return isAuth;
    },
    getAllUsers:()=>{
        return axios.get('/api/getAllUsers')
    },
    test: (props)=>{
        console.log(props);
        return true;
    },
    userLogout: () => {
        Cookies.remove('stJohnsCookie');
    }
  };
})();

export default dataMethods;
