import { actionType } from '../../shared/actionType';

export const getTableDataRequest = (payload) => {
    return {
        type: actionType.TABLEDATA_REQUEST,
        payload
    }
}

export const getTableDataSuccess = () => {
    return {
        type: actionType.TABLEDATA_SUCCESS
    }
}

export const getTableDataFailure = () => {
    return {
        type: actionType.TABLEDATA_FAILURE
    }
}