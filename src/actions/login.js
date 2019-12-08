import axios from "axios";
import Cookies from "js-cookie";
import setAuthorizationToken from '../utils/setAuthorizationToken'
import { SET_CURRENT_USER } from "./types";
import DataMethods from '../utils/data';
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
            DataMethods.setIsAuthenticated(true);
            // console.log('hello')
            return axios.get(nodeServer + nodePort + "/getUserForToken?token="+ cookie.token )
            .then(results =>{
                console.log(results)
                dispatch(setCurrentUser({ first_name:results.data.first_name, last_name:results.data.last_name, UID:results.data.UID}));
            })
            
        }
    }
  export function login(payload){
    return dispatch=>{
        return axios.post(nodeServer + nodePort + "/userLogin", payload)
            .then(results => {
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
                    dispatch(setCurrentUser({authToken:results.data.authenticationToken, first_name:results.data.first_name, last_name:results.data.last_name, UID:results.data.UID}))
                    code = 200;
                    break;
                case 204:
                    console.log("whoops");
                    code = 204;
                    break;
                case "default":
                    console.log("default");
                }
            return code;
        });
    }
}

