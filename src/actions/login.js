import axios from "axios";
import Cookies from "js-cookie";
import setAuthorizationToken from '../utils/setAuthorizationToken'
import { SET_CURRENT_USER } from "./types";
import {getUserData, getUserDataBegin} from './getUserData'
import dataMethods  from '../utils/data';
import { format} from 'date-fns'
const nodeServer = "http://localhost:";

const nodePort = 5000;

let isAuth = false;

    export function setCurrentUser(user){
        return{
            type:SET_CURRENT_USER,
            user:user
        }
    }
    export function renewSession(cookie){
    
        return dispatch =>{
            dataMethods.setIsAuthenticated(true);
            return axios.get(nodeServer + nodePort + "/getUserForToken?token="+ cookie.token )
            .then(results =>{
                dispatch(setCurrentUser({  username:results.data.username, first_name:results.data.first_name, last_name:results.data.last_name, UID:results.data.UID}));
                dispatch(getUserData(format(new Date(),'yyyy-MM-d'),results.data.UID))
            })
            
        }
    }
  export function login(payload){
    return async dispatch=>{
        const results = await axios.post(nodeServer + nodePort + "/userLogin", payload);
        let code;
        switch (results.data.code) {
            case 200:
                Cookies.set("stJohnsCookie", JSON.stringify({
                    token: results.data.authenticationToken
                }), { expires: new Date(results.data.tokenExpiryDate) });
                dispatch(setCurrentUser({ authToken: results.data.authenticationToken, username: results.data.username, first_name: results.data.first_name, last_name: results.data.last_name, UID: results.data.UID }));
                dispatch(getUserData(format(new Date(),'yyyy-MM-d'),results.data.UID))
                code = 200;
                break;
            case 204:
                code = 204;
                break;
            case "default":
        }
        return code;
    }
}

