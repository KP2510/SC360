import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import operationalStatusReducer from './operationalStatusReducer';
import joyRideReducer from './joyRideReducer';
import gridItemReducer from './gridItemReducer'
import personaReducer from './personaReducer';
import userReducer from './userReducer';
import userGroupReducer from './userGroupReducer';
import tableDataReducer from './tableDataReducer';
import variantsReducer from './variantsReducer';
import jobRolesReducer from './jobRolesReducer';
import systemRolesReducer from './systemRolesReducer';
import { actionType } from '../../shared/actionType';
import communicationReducer from './communicationReducer';
import userSettingsReducer from './userSettingsReducer';
import masterFilterReducer from './masterFilterReducer';

const appReducer = combineReducers({
    login: loginReducer,
    operationalStatus: operationalStatusReducer,
    joyRide: joyRideReducer,
    responsiveGrid: gridItemReducer,
    persona: personaReducer,
    users: userReducer,
    userGroups: userGroupReducer,
    tableData: tableDataReducer,
    variants: variantsReducer,
    communication : communicationReducer,
    jobRoles: jobRolesReducer,
    systemRoles: systemRolesReducer,
    userSettings: userSettingsReducer,
    masterFilter: masterFilterReducer,
})

const rootReducer = (state, action) => {
    if (action.type === actionType.LOGOUT) {
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer;