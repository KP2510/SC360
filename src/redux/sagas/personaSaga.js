import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';
import { cloneDeep } from 'lodash';

function* workerPersonaSaga(action) {
    // ForDemo
    // try {
    //     const personaRes = yield call(() => axiosInstance.get(`/persona`));
    //     const payload = cloneDeep(personaRes.data.data);

    //     yield put({ type: actionType.PERSONA_SUCCESS, payload });
    // } catch (e) {
    //     yield put({ type: actionType.PERSONA_FAILURE });
    //     console.log("e:", e)
    // }
};

export function* watcherPersonaSaga() {
    yield takeLatest(actionType.PERSONA_REQUEST, workerPersonaSaga)
}
