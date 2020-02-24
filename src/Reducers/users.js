import {GET_ALL_USERS, GET_ALL_USERS_SUCCESS,SAVE_USER_IS_ADMIN, SAVE_USER_IS_ADMIN_SUCCESS, DELETE_USERS_SUCCESS} from '../actions/types'
const initialState = {
    users:[],
    loading:false,
    error:null,
    success:false
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
        case DELETE_USERS_SUCCESS:
            return {
                ...state,
                deleteSuccess:true
            }
        case SAVE_USER_IS_ADMIN:
            return {
                ...state,
                loading:true
            }
        case SAVE_USER_IS_ADMIN_SUCCESS:
            return {
                ...state,
                loading:false,
                userSaveSuccess:true
            }
        default:
            return state;
    }
}