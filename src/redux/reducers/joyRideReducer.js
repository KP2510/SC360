import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'

const joyRideReducer = (state = defaultState.joyRide, action) => {
    switch (action.type) {
        case actionType.RUN_TOUR:
            return {
                ...state,
                runTour: action.payload
            };
        default:
            return state
    }
}

export default joyRideReducer;