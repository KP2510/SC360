import { actionType } from '../../shared/actionType';


//actions for all gridItem (card in RGL) data

export const gridItemRequest = (payload) => {
    return {
        type: actionType.GRID_ITEM_REQUEST,
        payload
    }
}

export const gridItemSuccess = (payload) => {
    return {
        type: actionType.GRID_ITEM_SUCCESS,
        payload
    }
}

export const gridItemFailure = (payload) => {
    return {
        type: actionType.GRID_ITEM_FAILURE,
        //payload
    }
}


//actions for show/hide gridItem (card in RGL) data

export const gridItemVisibilityRequest = (payload) => {
    return {
        type: actionType.SHOW_HIDE_REQUEST
    }
}

export const gridItemVisibilitySuccess = (payload) => {
    return {
        type: actionType.TOGGLE_GRID_ITEM_SUCCESS,
        payload
    }
}

export const gridItemVisibilityFailure = (payload) => {
    return {
        type: actionType.TOGGLE_GRID_ITEM_FALIURE,
        payload
    }
}