import { actionType } from '../../shared/actionType';

export const toggleLock = (payload) => {
    return {
        type: actionType.TOGGLE_LOCK,
        payload
    }
}

export const selectDropdown = (payload) => {
    return {
        type: actionType.SELECT_DROPDOWN,
        payload
    }
}

export const getRowDetail = (payload) => {
    return {
        type: actionType.GET_ROW_DETAIL,
        payload
    }
}

export const removeRowDetail = (payload) => {
    return {
        type: actionType.REMOVE_ROW_DETAIL,
        payload
    }
}

export const addMessageRequest = (payload) => {
    return {
        type: actionType.ADD_MESSAGE_REQUEST,
        payload
    }
}

export const addMessageSuccess = (payload) => {
    return {
        type: actionType.ADD_MESSAGE_SUCCESS,
        payload
    }
}

export const addMessageFailure = () => {
    return {
        type: actionType.ADD_MESSAGE_FAILURE,
    }
}

//For adding last communication in seperate object (lastMessageObj)
export const addLastMessageRequest = (payload) => {
    return {
        type: actionType.ADD_LAST_MESSAGE_REQUEST,
        payload
    }
}

export const addLastMessageSuccess = (payload) => {
    return {
        type: actionType.ADD_LAST_MESSAGE_SUCCESS,
        payload
    }
}

export const addLastMessageFailure = () => {
    return {
        type: actionType.ADD_LAST_MESSAGE_FAILURE,
    }
}
//For removing last communication from the seperate object (lastMessageObj)
export const removeLastMessageRequest = (payload) => {
    return {
        type: actionType.REMOVE_LAST_MESSAGE_REQUEST,
        payload
    }
}

export const removeLastMessageSuccess = () => {
    return {
        type: actionType.REMOVE_LAST_MESSAGE_SUCCESS
    }
}

export const removeLastMessageFailure = () => {
    return {
        type: actionType.REMOVE_LAST_MESSAGE_FAILURE,
    }
}

export const searchMessageRequest = (payload) => {
    return {
        type: actionType.SEARCH_MESSAGE_REQUEST,
        payload
    }
}

export const searchMessageSuccess = (payload) => {
    return {
        type: actionType.SEARCH_MESSAGE_SUCCESS,
        payload
    }
}

export const searchMessageFailure = () => {
    return {
        type: actionType.SEARCH_MESSAGE_FAILURE,
    }
}

export const getNotificationRequest = () => {
    return {
        type: actionType.GET_NOTIFICATION_REQUEST,
    }
}

export const getNotificationSuccess = (payload) => {
    return {
        type: actionType.GET_NOTIFICATION_SUCCESS,
        payload
    }
}

export const getNotificationFailure = () => {
    return {
        type: actionType.GET_NOTIFICATION_FAILURE,
    }
}

export const addNotificationRequest = (payload) => {
    return {
        type: actionType.ADD_NOTIFICATION_REQUEST,
        payload
    }
}

export const addNotificationSuccess = (payload) => {
    return {
        type: actionType.ADD_NOTIFICATION_SUCCESS,
        payload
    }
}

export const addNotificationFailure = () => {
    return {
        type: actionType.ADD_NOTIFICATION_FAILURE,
    }
}

export const addFilters = (payload) => {
    return {
        type: actionType.ADD_FILTERS,
        payload
    }
}