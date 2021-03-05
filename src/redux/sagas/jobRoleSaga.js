import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';

function* workerJobRoleSaga(action) {
    try {
        const jobData = yield call(() => axiosInstance.get('/job/roles'));
        console.log("jobData",jobData)
        yield put({ type: actionType.JOB_ROLE_SUCCESS, payload: jobData.data.data });
    } catch (e) {
        yield put({ type: actionType.JOB_ROLE_FAILURE });
    }
};


function* workerJobRoleCreateSaga(action) {
    try {
        const jobData = yield call(() => axiosInstance.post('/job/roles', { ...action.payload.jobData }));
        yield put({ type: actionType.JOB_ROLE_CREATE_SUCCESS, payload: jobData.data.data, job: action.payload.jobData  });
    } catch (e) {
        yield put({ type: actionType.JOB_ROLE_CREATE_FAILURE });
    }
};

function* workerJobRoleUpdateSaga(action) {
    try {
        const jobData = yield call(() => axiosInstance.put('/job/roles', { ...action.payload.jobData }));
        yield put({ type: actionType.JOB_ROLE_UPDATE_SUCCESS, payload: jobData.data.data, job: action.payload.jobData  });
    } catch (e) {
        yield put({ type: actionType.JOB_ROLE_UPDATE_FAILURE });
    }
};

function* workerJobRoleDeleteSaga(action) {
    try {
        const jobData = yield call(() => axiosInstance.delete('/job/roles', { data: { jobID: action.payload } }));
        yield put({ type: actionType.JOB_ROLE_DELETE_SUCCESS, payload: action.payload });
    } catch (e) {
        yield put({ type: actionType.JOB_ROLE_DELETE_FAILURE });
    }
};

export function* watcherJobRoleSaga() {
    yield takeLatest(actionType.JOB_ROLE_REQUEST, workerJobRoleSaga)
    yield takeLatest(actionType.JOB_ROLE_CREATE_REQUEST, workerJobRoleCreateSaga)
    yield takeLatest(actionType.JOB_ROLE_UPDATE_REQUEST, workerJobRoleUpdateSaga)
    yield takeLatest(actionType.JOB_ROLE_DELETE_REQUEST, workerJobRoleDeleteSaga)
}
