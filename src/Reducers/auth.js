import {SET_CURRENT_USER} from '../actions/types';
// import { isEmptyStatement } from "@babel/types";

const initialState={
    isAuthenticated:false,
    userDetails:{}
}
export default(state=initialState,action={})=>{
    
    switch(action.type){
        case SET_CURRENT_USER:
            console.log(action.user)
            return {
                isAuthenticated:true,
                user:action.user
            }
        default:return state;
    }
}