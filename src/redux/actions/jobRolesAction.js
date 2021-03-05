import { actionType } from '../../shared/actionType';

export const getJobRoleRequest = () => {
    return {
        type: actionType.JOB_ROLE_REQUEST
    }
}

export const getJobRoleSuccess = () => {
    return {
        type: actionType.JOB_ROLE_SUCCESS
    }
}

export const getJobRoleFailure = () => {
    return {
        type: actionType.JOB_ROLE_FAILURE
    }
}

export const createJobRoleRequest = (payload) => {
    return {
        type: actionType.JOB_ROLE_CREATE_REQUEST,
        payload
    }
}

export const createJobRoleSuccess = (payload) => {
    return {
        type: actionType.JOB_ROLE_CREATE_SUCCESS,
        payload
    }
}

export const createJobRoleFailure = (payload) => {
    return {
        type: actionType.JOB_ROLE_CREATE_FAILURE,
        payload
    }
}

export const updateJobRoleRequest = (payload) => {
    return {
        type: actionType.JOB_ROLE_UPDATE_REQUEST,
        payload
    }
}

export const updateJobRoleSuccess = (payload) => {
    return {
        type: actionType.JOB_ROLE_UPDATE_SUCCESS,
        payload
    }
}

export const updateJobRoleFailure = (payload) => {
    return {
        type: actionType.JOB_ROLE_UPDATE_FAILURE,
        payload
    }
}

export const deleteJobRoleRequest = (payload) => {
    return {
        type: actionType.JOB_ROLE_DELETE_REQUEST,
        payload
    }
}

export const deleteJobRoleSuccess = (payload) => {
    return {
        type: actionType.JOB_ROLE_DELETE_SUCCESS,
        payload
    }
}

export const deleteJobRoleFailure = (payload) => {
    return {
        type: actionType.JOB_ROLE_DELETE_FAILURE,
        payload
    }
}