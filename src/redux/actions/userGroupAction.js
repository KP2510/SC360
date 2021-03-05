import { actionType } from '../../shared/actionType';

export const getUserGroupRequest = () => {
    return {
        type: actionType.USER_GROUP_REQUEST
        
    }
}

export const getUserGroupSuccess = () => {
    return {
        type: actionType.USER_GROUP_SUCCESS
        
    }
}

export const getUserGroupFailure = () => {
    return {
        type: actionType.USER_GROUP_FAILURE
        
    }
}

export const createUserGroupRequest = (payload, success, failure) => {
    return {
        type: actionType.USER_GROUP_CREATE_REQUEST,
        payload, success, failure
    }
}

export const createUserGroupSuccess = (payload) => {
    return {
        type: actionType.USER_GROUP_CREATE_SUCCESS,
        payload
    }
}

export const createUserGroupFailure = (payload) => {
    return {
        type: actionType.USER_GROUP_CREATE_FAILURE,
        payload
    }
}

export const deleteUserGroupRequest = (payload, success, failure) => {
    return {
        type: actionType.USER_GROUP_DELETE_REQUEST,
        payload, success, failure
    }
}

export const deleteUserGroupSuccess = (payload) => {
    return {
        type: actionType.USER_GROUP_DELETE_SUCCESS,
        payload
    }
}

export const deleteUserGroupFailure = (payload) => {
    return {
        type: actionType.USER_GROUP_DELETE_FAILURE,
        payload
    }
}

export const addUserToUserGroupRequest = (payload, user, success, failure) => {
    return {
        type: actionType.UG_ADD_USER_REQUEST,
        payload,
        user, success, failure
    }
}

export const addUserToUserGroupSuccess = (payload) => {
    return {
        type: actionType.UG_ADD_USER_SUCCESS,
        payload
    }
}

export const addUserToUserGroupFailure = (payload) => {
    return {
        type: actionType.UG_ADD_USER_FAILURE,
        payload
    }
}

export const deleteUserToUserGroupRequest = (payload, user, success, failure) => {
    return {
        type: actionType.UG_DELETE_USER_REQUEST,
        payload,
        user, success, failure
    }
}

export const deleteUserToUserGroupSuccess = (payload) => {
    return {
        type: actionType.UG_DELETE_USER_SUCCESS,
        payload
    }
}

export const deleteUserToUserGroupFailure = (payload) => {
    return {
        type: actionType.UG_DELETE_USER_FAILURE,
        payload
    }
}