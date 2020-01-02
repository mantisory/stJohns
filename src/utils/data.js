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
        nodeServer +
          nodePort +
          "/checkValueExists?valueName=" +
          valueName +
          "&value=" +
          value
      );
    },

    getScheduledShifts: (currentDate, UID) => {
      return axios.get(
        nodeServer +
          nodePort +
          "/getScheduledShiftsForUser?selectedDate=" +
          currentDate +
          "&UID=" +
          UID
      );
    },
    getScheduledShiftsForDate:currentDate => {
        return axios.get(
            nodeServer +
              nodePort +
              "/getScheduledShiftsForDate?selectedDate=" +
              currentDate
          );
    },
    getScheduledShiftsForAllUsers: currentDate => {
      return axios.get(
        nodeServer +
          nodePort +
          "/getScheduledShiftsForAllUsers?selectedDate=" +
          currentDate
      );
    },

    saveShifts: async (shifts, UID) => {
        console.log('in data save')
        console.log(shifts)
      let shiftsSaved = shifts.map(shift => {
        if (shift.scheduled_shift_ID) {
          return axios
            .put(
              nodeServer +
                nodePort +
                "/updateShift?shiftID=" +
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
              nodeServer +
                nodePort +
                "/addShift?UID=" +
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
      return axios.post(nodeServer + nodePort + "/userRegister", payload);
    },

    emailValidate: payload => {
      return axios.post(nodeServer + nodePort + "/emailValidate", payload);
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
        return axios.get(nodeServer+nodePort+'/getAllUsers')
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
