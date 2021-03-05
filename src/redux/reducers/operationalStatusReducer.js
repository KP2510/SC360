import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'

const operationalStatusReducer = (state = defaultState.operationalStatus, action) => {
    switch (action.type) {
        case actionType.KPI_DATA_SUCCESS:
            return {
                ...state,
                kpiData : action.payload
            };
        case actionType.OPERATIONAL_STATUS_SUCCESS:
            return {
                ...state,
                editCardData: action.payload
            };
        case actionType.OPERATIONAL_STATUS_FAILURE:
            return {};
        default:
            return state
    }
}

export default operationalStatusReducer;