import { actionType } from '../../shared/actionType';

export const getSystemRoleRequest = () => {
    return {
        type: actionType.SYSTEM_ROLE_REQUEST
    }
}

export const getSystemRoleSuccess = () => {
    return {
        type: actionType.SYSTEM_ROLE_SUCCESS
    }
}

export const getSystemRoleFailure = () => {
    return {
        type: actionType.SYSTEM_ROLE_FAILURE
    }
}

export const createSystemRoleRequest = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_CREATE_REQUEST,
        payload
    }
}

export const createSystemRoleSuccess = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_CREATE_SUCCESS,
        payload
    }
}

export const createSystemRoleFailure = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_CREATE_FAILURE,
        payload
    }
}

export const updateSystemRoleRequest = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_UPDATE_REQUEST,
        payload
    }
}

export const updateSystemRoleSuccess = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_UPDATE_SUCCESS,
        payload
    }
}

export const updateSystemRoleFailure = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_UPDATE_FAILURE,
        payload
    }
}

export const deleteSystemRoleRequest = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_DELETE_REQUEST,
        payload
    }
}

export const deleteSystemRoleSuccess = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_DELETE_SUCCESS,
        payload
    }
}

export const deleteSystemRoleFailure = (payload) => {
    return {
        type: actionType.SYSTEM_ROLE_DELETE_FAILURE,
        payload
    }
}