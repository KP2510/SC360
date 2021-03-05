import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'
import { cloneDeep } from 'lodash';

const userSettingsReducer = (state = defaultState.userSettings, action) => {
    //console.log("reducer acc", action);
    switch (action.type) {
        case actionType.USER_SETTINGS_SUCCESS:
            return action.payload;
        case actionType.USER_SETTINGS_UPDATE_SUCCESS:
            let newObj = {}
            if (action.payload.key === "dashboards") {
                newObj = {
                    ...state,
                    dashboards: action.payload.data.dashboards
                }
            } else if (action.payload.key === "accountSettings") {
                newObj = {
                    ...state,
                    accountSettings: {
                        ...state.accountSettings,
                        ...action.payload.data
                    }
                }
            }
            return newObj;
        default:
            return state
    }
}

export default userSettingsReducer;