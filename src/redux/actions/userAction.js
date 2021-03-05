import { actionType } from '../../shared/actionType';

export const getUserRequest = () => {
    return {
        type: actionType.USER_REQUEST
    }
}

export const getUserSuccess = () => {
    return {
        type: actionType.USER_SUCCESS
    }
}

export const getUserFailure = () => {
    return {
        type: actionType.USER_FAILURE
    }
}

export const createUserRequest = (payload, success, failure) => {
    return {
        type: actionType.USER_CREATE_REQUEST,
        payload, success, failure
    }
}

export const createUserSuccess = (payload) => {
    return {
        type: actionType.USER_CREATE_SUCCESS,
        payload
    }
}

export const createUserFailure = (payload) => {
    return {
        type: actionType.USER_CREATE_FAILURE,
        payload
    }
}

export const updateUserRequest = (payload, success, failure) => {
    return {
        type: actionType.USER_UPDATE_REQUEST,
        payload, success, failure
    }
}

export const updateUserSuccess = (payload) => {
    return {
        type: actionType.USER_UPDATE_SUCCESS,
        payload
    }
}

export const updateUserFailure = (payload) => {
    return {
        type: actionType.USER_UPDATE_FAILURE,
        payload
    }
}

export const deleteUserRequest = (payload, success, failure) => {
    return {
        type: actionType.USER_DELETE_REQUEST,
        payload, success, failure
    }
}

export const deleteUserSuccess = (payload) => {
    return {
        type: actionType.USER_DELETE_SUCCESS,
        payload
    }
}

export const deleteUserFailure = (payload) => {
    return {
        type: actionType.USER_DELETE_FAILURE,
        payload
    }
}