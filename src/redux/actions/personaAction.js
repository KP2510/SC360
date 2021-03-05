import { actionType } from '../../shared/actionType';

//actions for all persona data
export const personaRequest = (payload) => {
    return {
        type: actionType.PERSONA_REQUEST,
        payload
    }
}

export const personaSuccess = (payload) => {
    return {
        type: actionType.PERSONA_SUCCESS,
        payload
    }
}

export const personaFailure = (payload) => {
    return {
        type: actionType.PERSONA_FAILURE,
    }
}