import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';
import { cloneDeep } from 'lodash';

function* workerGridItemSaga(action) {
    try {
        const gridCardRes = yield call(() => axiosInstance.get('/cardDetails'));
        const payload = cloneDeep(gridCardRes.data.data.Items).map(i => {
            i.cardName = i.cardName.toUpperCase();
            return i;
        })

        yield put({ type: actionType.GRID_ITEM_SUCCESS, payload });
    } catch (e) {
        yield put({ type: actionType.GRID_ITEM_FAILURE });
        console.log("e:", e)
    }
};

function* workerShowHideGridItemSaga(action) {
    try {
        const showHideRes = yield call(() => axiosInstance.put(`/cardDetails/${action.payload.cardId}`, { isChecked: action.payload.checked }));
        const payload = { cardId: action.payload.cardId, isChecked: cloneDeep(showHideRes).data.data.Attributes.isChecked}
        yield put({ type: actionType.TOGGLE_GRID_ITEM_SUCCESS, payload });

    } catch (e) {
        yield put({ type: actionType.TOGGLE_GRID_ITEM_FALIURE });
        console.log("e:", e)
    }
};


export function* watcherGridItemSaga() {
    //console.log("watcherLoginSaga")
    yield takeLatest(actionType.GRID_ITEM_REQUEST, workerGridItemSaga)
    yield takeLatest(actionType.SHOW_HIDE_REQUEST, workerShowHideGridItemSaga)
}
