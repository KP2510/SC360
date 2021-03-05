import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';

function* workerSystemRoleSaga(action) {
    try {
        const roleData = yield call(() => axiosInstance.get('/system/roles'));
        yield put({ type: actionType.SYSTEM_ROLE_SUCCESS, payload: roleData.data.data });
        console.log(roleData.data.data,"rolesData");
    } catch (e) {
        yield put({ type: actionType.SYSTEM_ROLE_FAILURE });
    }
};


function* workerSystemRoleCreateSaga(action) {
    try {
        const roleData = yield call(() => axiosInstance.post('/system/roles', { ...action.payload.roleData }));
        yield put({ type: actionType.SYSTEM_ROLE_CREATE_SUCCESS, payload: roleData.data.data, system: action.payload.roleData  });
    } catch (e) {
        yield put({ type: actionType.SYSTEM_ROLE_CREATE_FAILURE });
    }
};

function* workerSystemRoleUpdateSaga(action) {
    try {
        const roleData = yield call(() => axiosInstance.put('/system/roles', { ...action.payload.roleData }));
        yield put({ type: actionType.SYSTEM_ROLE_UPDATE_SUCCESS, payload: roleData.data.data, system: action.payload.roleData  });
    } catch (e) {
        yield put({ type: actionType.SYSTEM_ROLE_UPDATE_FAILURE });
    }
};

function* workerSystemRoleDeleteSaga(action) {
    try {
        const roleData = yield call(() => axiosInstance.delete('/system/roles', { data: { systemID: action.payload } }));
        yield put({ type: actionType.SYSTEM_ROLE_DELETE_SUCCESS, payload: action.payload });
    } catch (e) {
        yield put({ type: actionType.SYSTEM_ROLE_DELETE_FAILURE });
    }
};

export function* watcherSystemRoleSaga() {
    yield takeLatest(actionType.SYSTEM_ROLE_REQUEST, workerSystemRoleSaga)
    yield takeLatest(actionType.SYSTEM_ROLE_CREATE_REQUEST, workerSystemRoleCreateSaga)
    yield takeLatest(actionType.SYSTEM_ROLE_UPDATE_REQUEST, workerSystemRoleUpdateSaga)
    yield takeLatest(actionType.SYSTEM_ROLE_DELETE_REQUEST, workerSystemRoleDeleteSaga)
}
