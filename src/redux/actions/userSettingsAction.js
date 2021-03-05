import { actionType } from '../../shared/actionType';

export const userSettingsRequest = () => {
    return {
        type: actionType.USER_SETTINGS_REQUEST
    }
}
export const userSettingsSuccess = (payload) => {
    return {
        type: actionType.USER_SETTINGS_SUCCESS,
        payload
    }
}
export const getUserSettingsFailure = () => {
    return {
        type: actionType.USER_CREATE_FAILURE

    }
}

export const userSettingsUpdateDashboard = (payload) => {
    return {
        type: actionType.USER_SETTINGS_UPDATE_DASHBOARD
    }
}
export const userSettingsUpdateReports = (payload) => {
    return {
        type: actionType.USER_SETTINGS_UPDATE_REPORTS,
        payload
    }
}
export const userSettingsUpdateAccount = () => {
    return {
        type: actionType.USER_SETTINGS_UPDATE_ACCOUNT
    }
}
export const userSettingsUpdateSuccess = (payload) => {
    return {
        type: actionType.USER_SETTINGS_UPDATE_SUCCESS,
        payload
    }
}
export const userSettingsUpdateFailure = () => {
    return {
        type: actionType.USER_SETTINGS_UPDATE_FAILURE
    }
}