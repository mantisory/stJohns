import {GET_ALL_USERS, GET_ALL_USERS_SUCCESS} from '../actions/types'
const initialState = {
    users:[],
    loading:false,
    error:null
}
export default(state=initialState,action={})=>{
    switch (action.type){
        case GET_ALL_USERS:
            return {
                ...state,
                loading:true,
                error:null
            };
        case GET_ALL_USERS_SUCCESS:
            return {
                ...state,
                loading:false,
                users: action.users
            }
        default:
            return state;
    }
}