import { actionType } from '../../shared/actionType';

const operationalStatusRequest = (payload) => {
    return {
        type: actionType.OPERATIONAL_STATUS_REQUEST,
        payload
    }
}

const operationalStatusSuccess = (payload) => {
    return {
        type: actionType.OPERATIONAL_STATUS_SUCCESS,
        payload
    }
}

const operationalStatusFailure = (payload) => {
    return {
        type: actionType.OPERATIONAL_STATUS_FAILURE,
        //payload
    }
}

const kpiDataSuccess = (payload) => {
    return {
        type: actionType.LOGOUT,
        payload
    }
}

export const operationaStatusAction = {
    operationalStatusRequest,
    operationalStatusSuccess,
    operationalStatusFailure,
    kpiDataSuccess
};