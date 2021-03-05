import { actionType } from '../../shared/actionType';

 export const loginRequest = (payload) => {
    return {
        type: actionType.LOGIN_REQUEST,
        payload
    }
}

export const loginSuccess = (payload) => {
    return {
        type: actionType.LOGIN_SUCCESS,
        payload
    }
}

export const loginFailure = (payload) => {
    return {
        type: actionType.LOGIN_FAILURE,
        //payload
    }
}

export const logout = () => {
    return {
        type: actionType.LOGOUT
    }
}