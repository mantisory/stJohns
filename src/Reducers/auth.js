import {SET_CURRENT_USER} from '../actions/types';
// import { isEmptyStatement } from "@babel/types";

const initialState={
    isAuthenticated:false,
    user:null,
    loading:true
}
export default(state=initialState,action={})=>{
    switch(action.type){
        case SET_CURRENT_USER:
            return {
                isAuthenticated:true,
                user:action.user,
                loading:false
            }
        default:
            return state;
    }
}