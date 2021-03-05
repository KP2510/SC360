import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'
import { updateObject } from "../../utils/helper";

const masterFilterReducer = (state = defaultState.masterFilter, action) => {
    switch (action.type) {
        case actionType.ADD_DROPDOWN_VALUE_SUCCESS:
            return updateObject(state, {
                productLine: action.payload.productLine,
                region: action.payload.region,
                planner: action.payload.planner
            });
        default:
            return state
    }
}

export default masterFilterReducer;