import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'

const personaReducer = (state = defaultState.personaData, action) => {
    switch (action.type) {
        case actionType.PERSONA_SUCCESS:
            return {
                ...state,
                personaData: action.payload
            };
        case actionType.PERSONA_FAILURE:
            return {
                ...state,
                personaData: []
            };
        default:
            return state;
    }
}

export default personaReducer;