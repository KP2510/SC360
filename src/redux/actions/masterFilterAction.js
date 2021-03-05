import { actionType } from '../../shared/actionType';


//actions for all gridItem (card in RGL) data

export const addDropdownRequest = (payload) => {
    return {
        type: actionType.ADD_DROPDOWN_VALUE_REQUEST,
        payload
    }
}

export const addDropdownSuccess = (payload) => {
    return {
        type: actionType.ADD_DROPDOWN_VALUE_SUCCESS,
        payload
    }
}

export const addDropdownFailure = () => {
    return {
        type: actionType.ADD_LAST_MESSAGE_FAILURE
    }
}