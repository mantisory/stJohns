import axios from "axios";
import Cookies from "js-cookie";
const nodeServer = "http://localhost:";
const nodePort = 5000;

let isAuth = false;

const dataMethods = (function () {
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
        getLocationShifts: (locationID, dayValue) => {
            return axios.get("/api/getShiftsForLocationAndDay?locationID=" + locationID + "&dayValue=" + dayValue)
        },
        getAllAvailableShifts: () => {
            return axios.get("/api/getAllAvailableShifts");
        },
        getScheduledShifts: (currentDate, UID) => {
            return axios.get(
                // nodeServer +nodePort +
                "/api/getScheduledShiftsForUser?selectedDate=" +
                currentDate +
                "&UID=" +
                UID
            );
        },
        getScheduledShiftsForDate: (currentDate) => {
            return axios.get(
                // nodeServer +nodePort +
                "/api/getScheduledShiftsForDate?selectedDate=" +
                currentDate
            );
        },
        getScheduledShiftsForMonth: (currentDate, location) => {
            return axios.get(
                "/api/getScheduledShiftsForMonth?selectedDate=" +
                currentDate
            );
        },
        getScheduledShiftsForAllUsers: (currentDate, location) => {
            return axios.get(
                // nodeServer + nodePort +
                "/api/getScheduledShiftsForAllUsers?selectedDate=" +
                currentDate + "&location=" + location
            );
        },
        deleteShift: async (shiftID) => {
            const payload = { shiftID: shiftID }
            return axios.post("/api/deleteShift", payload)
        },
        saveShifts: async (shifts, scheduledDate, locationID, UID) => {
            let shiftsSaved = shifts.map(shift => {
                if (shift.scheduled_shift_ID) {
                    return axios
                        .put(
                            "/api/updateShift?shiftID=" +
                            shift.scheduled_shift_ID +
                            "&selectedDate=" +
                            scheduledDate +
                            "&shiftValue=" +
                            shift.scheduled_shift +
                            "&location=" + locationID
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
                            scheduledDate +
                            "&shiftValue=" +
                            shift.scheduled_shift +
                            "&location=" + locationID
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
        saveShiftsInRange: async (shifts) => {
            // console.log(shifts)
            let shiftsSaved = shifts.map(shift => {
                axios
                    .put(
                        //   nodeServer +nodePort +
                        "/api/addShift?UID=" +
                        shift.UID +
                        "&selectedDate=" +
                        shift.scheduledDate +
                        "&shiftValue=" +
                        shift.scheduled_shift +
                        "&location=" + shift.locationID
                    )
                    .then(res => {
                        return res;
                    });
            })
            return Promise.all(shiftsSaved).then(res => {
                return 'success';
            });
        },
        checkUsersExist: (users) => {
            let newUsers = [];
            let existingUsers = [];

            let usersProcessed = users.map(user => {
                return axios.get('/api/checkUserExists?username=' + user.username + '&email=' + user.email).then(response => {
                    console.log(response)
                    if (response.data[0].userExists === 1) {
                        existingUsers.push(user)
                    } else {
                        newUsers.push(user)
                    }
                    return user
                })

            })
            return Promise.all(usersProcessed).then(res => {
                return { existingUsers, newUsers }
            })
        },
        userRegister: payload => {
            return axios.post("/api/userRegister", payload);
        },

        saveUserAdmin: userList => {
            let usersUpdated = userList.map(user => {
                return axios.post("/api/updateUserAdmin", user).then(res => res);
            });
            return Promise.all(usersUpdated).then(res => {
                return res;
            })
        },

        deleteUsers: userList => {
            let usersDeleted = userList.map(user => {
                return axios.post("/api/deleteUser", user).then(res => res);
                // return ""
            });
            return Promise.all(usersDeleted).then(res => {
                return res;
            })
        },
        checkPassword: (payload) => {
            return axios.post('/api/checkPassword', payload);
        },
        changePassword: (payload) => {
            return axios.post('/api/changePassword', payload);
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
        getAllUsers: () => {
            return axios.get('/api/getAllUsers')
        },
        test: (props) => {
            return true;
        },
        userLogout: () => {
            const cookie = Cookies.get("stJohnsCookie");
            const payload = { token: JSON.parse(cookie).token }
            axios.post('/api/logOut', payload).then(res => {
                Cookies.remove('stJohnsCookie');
            })

        }
    };
})();

export default dataMethods;
