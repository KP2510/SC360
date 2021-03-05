import { all } from 'redux-saga/effects'
import { watcherLoginSaga } from './loginSaga';
import { watcherOperationalStatusSaga } from './operationalStatusSaga';
import { watcherJoyRideSaga } from './joyRideSaga'
import { watcherGridItemSaga } from './gridItemSaga';
import { watcherPersonaSaga } from './personaSaga';
import { watcherUserSaga } from './userSaga';
import { watcherUserGroupSaga } from './userGroupSaga';
import { watcherTableDataSaga } from './tableDataSaga';
import { watcherVariantsSaga } from './variantsSaga';
import { watcherCommunicationSaga } from './communicationSaga';
import { watcherJobRoleSaga } from './jobRoleSaga';
import { watcherSystemRoleSaga } from './systemRoleSaga';
import { watcherUserSettingsSaga } from './userSettingsSaga';
import { watcherMasterFilterSaga } from './masterFilterSaga';

// only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
    yield all([
        watcherLoginSaga(),
        watcherOperationalStatusSaga(),
        watcherJoyRideSaga(),
        watcherGridItemSaga(),
        watcherPersonaSaga(),
        watcherUserSaga(),
        watcherUserGroupSaga(),
        watcherTableDataSaga(),
        watcherVariantsSaga(),
        watcherCommunicationSaga(),
        watcherJobRoleSaga(),
        watcherSystemRoleSaga(),
        watcherUserSettingsSaga(),
        watcherMasterFilterSaga(),
    ])
}