import axios from "axios";
import Cookies from "js-cookie";
import { SET_CURRENT_USER, SET_CURRENT_USER_FAIL } from "./types";
import { getUserData } from "./getUserData";
import dataMethods from "../utils/data";
import { format } from "date-fns";
const nodeServer = "http://localhost:";

const nodePort = 5000;

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user: user
  };
}
export function loginError(){
    return{
        type: SET_CURRENT_USER_FAIL,
        error:'you are fucked'
    }
}
export function setCurrentUserFail(error) {
  return {
    type: SET_CURRENT_USER_FAIL,
    user: null,
    error: error
  };
}
export function renewSession(cookie) {
  return dispatch => {
    dataMethods.setIsAuthenticated(true);
    return axios
      .get("/api/getUserForToken?token=" + cookie.token)
      .then(results => {
          console.log(results)
        if(results.data.code!==204){
            dispatch(
                setCurrentUser({
                  username: results.data.username,
                  first_name: results.data.first_name,
                  last_name: results.data.last_name,
                  UID: results.data.UID,
                  isAdmin: results.data.isAdmin
                })
              );
              dispatch(getUserData(format(new Date(),'yyyy-MM-d'),results.data.UID))
        }else{
            dispatch(loginError())
        }
        
      });
  };
}
export function login(payload) {
  return async dispatch => {
    const results = await axios.post(
    //   nodeServer + nodePort + "/userLogin",
     "/api/userLogin",
      payload
    );
    let code;

    switch (results.data.code) {
      case 200:
        Cookies.set(
          "stJohnsCookie",
          JSON.stringify({
            token: results.data.authenticationToken
          }),
          { expires: new Date(results.data.tokenExpiryDate) }
        );
        dispatch(
          setCurrentUser({
            authToken: results.data.authenticationToken,
            username: results.data.username,
            first_name: results.data.first_name,
            last_name: results.data.last_name,
            UID: results.data.UID,
            isAdmin: results.data.isAdmin
          })
        );
        code = 200;
        break;
      case 204:
        code = 204;
        break;
      case 308:
        dispatch(setCurrentUserFail(results.data));
        code = 308;
        break;

      case 307:
        dispatch(setCurrentUserFail(results.data));
        code = 307;
        break;
      case 309:
        dispatch(setCurrentUserFail(results.data));
        code = 309;
        break;
      default:
        break;
    }
    return code;
  };
}
