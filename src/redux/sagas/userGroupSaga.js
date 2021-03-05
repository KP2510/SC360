import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';

function* workerUserGroupSaga(action) {
    try {
        const userGroupData = yield call(() => axiosInstance.get('/userGroups'));
        yield put({ type: actionType.USER_GROUP_SUCCESS, payload: userGroupData.data.data });
    } catch (e) {
        yield put({ type: actionType.USER_GROUP_FAILURE });
    }
};

function* workerCreateUserGroupSaga(action) {
    try {
        const userGroupData = yield call(() => axiosInstance.post('/userGroups/add', action.payload));
        yield put({ type: actionType.USER_GROUP_CREATE_SUCCESS, payload: userGroupData.data.data });
        action.success && action.success();
    } catch (e) {
        yield put({ type: actionType.USER_GROUP_CREATE_FAILURE });
        action.failure && action.failure();
    }
};

function* workerDeleteUserGroupSaga(action) {
    try {
        const userGroupData = yield call(() => axiosInstance.delete(`/userGroups/${action.payload}`));
        yield put({ type: actionType.USER_GROUP_DELETE_SUCCESS, payload: action.payload });
        action.success && action.success();
    } catch (e) {
        yield put({ type: actionType.USER_GROUP_DELETE_FAILURE });
        action.failure && action.failure();
    }
};

function* workerAddUserSaga(action) {
    try {
        yield call(() => axiosInstance.put('/userGroups/assign', action.payload));
        yield put({ type: actionType.UG_ADD_USER_SUCCESS, payload: action.payload, user: action.user });
    } catch (e) {
        yield put({ type: actionType.UG_ADD_USER_FAILURE });
    }
};

function* workerDeleteUserSaga(action) {
    try {
        yield call(() => axiosInstance.put('/userGroups/unassign', action.payload));
        yield put({ type: actionType.UG_DELETE_USER_SUCCESS, payload: action.payload, user: action.user  });
    } catch (e) {
        yield put({ type: actionType.UG_DELETE_USER_FAILURE });
    }
};

export function* watcherUserGroupSaga() {
    yield takeLatest(actionType.USER_GROUP_REQUEST, workerUserGroupSaga)
    yield takeLatest(actionType.UG_ADD_USER_REQUEST, workerAddUserSaga)
    yield takeLatest(actionType.UG_DELETE_USER_REQUEST, workerDeleteUserSaga)
    yield takeLatest(actionType.USER_GROUP_CREATE_REQUEST, workerCreateUserGroupSaga)
    yield takeLatest(actionType.USER_GROUP_DELETE_REQUEST, workerDeleteUserGroupSaga)
}