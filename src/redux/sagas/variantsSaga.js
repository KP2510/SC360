import { call, put, takeEvery } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';

function* workerVariantsSaga(action) {
    // ForDemo
    try {
        const variants = yield call(() => axiosInstance.get(`/variants?persID=${action.payload.persID}&userID=${action.payload.userId}`));
        yield put({ type: actionType.VARIANTS_SUCCESS, payload: variants.data.data, persID: action.payload.persID });
    } catch (e) {
        yield put({ type: actionType.VARIANTS_FAILURE });
    }
};

export function* watcherVariantsSaga() {
    yield takeEvery(actionType.VARIANTS_REQUEST, workerVariantsSaga)
}