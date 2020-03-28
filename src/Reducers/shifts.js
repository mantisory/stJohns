import { GET_USER_DATA_BEGIN, GET_USER_DATA_SUCCESS, GET_AVAILABLE_SHIFTS, GET_AVAILABLE_SHIFTS_SUCCESS, SAVE_USER_SHIFTS, SAVE_USER_SHIFTS_IN_RANGE, GET_ALL_SHIFTS_FOR_DATE, GET_ALL_SHIFTS_FOR_DATE_SUCCESS, GET_ALL_SHIFTS_FOR_MONTH_SUCCESS, GET_ALL_SHIFTS_FOR_MONTH } from '../actions/types'

const initialState = {
    shifts: [],
    availableShifts: [],
    loading: false,
    error: null
}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case GET_USER_DATA_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_USER_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                shifts: action.shifts
            }
        case GET_AVAILABLE_SHIFTS:
            return {
                ...state,
                loading: true,
                error: null
            }
        case GET_AVAILABLE_SHIFTS_SUCCESS:
            return {
                ...state,
                loading: false,
                availableShifts: action.availableShifts
            }
        case SAVE_USER_SHIFTS:
            return {
                ...state,
                loading: true,
                error: null
            }
        case SAVE_USER_SHIFTS_IN_RANGE:
            return {
                ...state,
                loading: true,
                error: null
            }
        case GET_ALL_SHIFTS_FOR_DATE:
            return {
                ...state,
                loading: true,
                error: null
            }
        case GET_ALL_SHIFTS_FOR_DATE_SUCCESS:
            return {
                ...state,
                loading: false,
                shifts: action.shifts
            }
        case GET_ALL_SHIFTS_FOR_MONTH_SUCCESS:
            return {
                ...state,
                loading: false,
                allShiftsForMonth: action.monthlyShifts
            }
        default:
            return state;
    }
}