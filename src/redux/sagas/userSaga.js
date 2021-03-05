import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';

function* workerUserSaga(action) {
    try {
        const userData = yield call(() => axiosInstance.get('/users'));
        yield put({ type: actionType.USER_SUCCESS, payload: userData.data.data });
    } catch (e) {
        yield put({ type: actionType.USER_FAILURE });
    }
};


function* workerUserCreateSaga(action) {
    try {
        const userData = yield call(() => axiosInstance.post('/users', { ...action.payload.userData }));
        yield put({ type: actionType.USER_CREATE_SUCCESS, payload: userData.data.data, user: action.payload.userData  });
        action.success && action.success();
    } catch (e) {
        yield put({ type: actionType.USER_CREATE_FAILURE });
        action.failure && action.failure();
    }
};

function* workerUserUpdateSaga(action) {
    try {
        const userData = yield call(() => axiosInstance.put('/users', { ...action.payload.userData }));
        yield put({ type: actionType.USER_UPDATE_SUCCESS, payload: userData.data.data, user: action.payload.userData  });
        action.success && action.success();
    } catch (e) {
        yield put({ type: actionType.USER_UPDATE_FAILURE });
        action.failure && action.failure();
    }
};

function* workerUserDeleteSaga(action) {
    try {
        const userData = yield call(() => axiosInstance.delete('/users', { data: { userID: action.payload } }));
        yield put({ type: actionType.USER_DELETE_SUCCESS, payload: action.payload });
        action.success && action.success();
    } catch (e) {
        yield put({ type: actionType.USER_DELETE_FAILURE });
        action.failure && action.failure();
    }
};

export function* watcherUserSaga() {
    yield takeLatest(actionType.USER_REQUEST, workerUserSaga)
    yield takeLatest(actionType.USER_CREATE_REQUEST, workerUserCreateSaga)
    yield takeLatest(actionType.USER_UPDATE_REQUEST, workerUserUpdateSaga)
    yield takeLatest(actionType.USER_DELETE_REQUEST, workerUserDeleteSaga)
}
