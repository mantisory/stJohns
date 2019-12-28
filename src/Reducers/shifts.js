import {GET_USER_DATA_BEGIN, GET_USER_DATA_SUCCESS, SAVE_USER_SHIFTS} from '../actions/types'

const initialState = {
    shifts:[],
    loading:false,
    error:null
}

export default(state=initialState,action={})=>{
    switch (action.type){
        case GET_USER_DATA_BEGIN:
            return {
                ...state,
                loading:true,
                error:null
            };
        case GET_USER_DATA_SUCCESS:
            return {
                ...state,
                loading:false,
                shifts: action.shifts
            }
        case SAVE_USER_SHIFTS:
            return {
                ...state,
                loading:true,
                error:null
            }
        default:
            return state;
    }
}