import { put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';

function* workerMasterFilterSaga(action) {
    try {
        yield put({ type: actionType.ADD_DROPDOWN_VALUE_SUCCESS, payload: action.payload });
    } catch (e) {
        yield put({ type: actionType.LOGIN_FAILURE, payload: e.message });
    }
};


export function* watcherMasterFilterSaga() {
    yield takeLatest(actionType.ADD_DROPDOWN_VALUE_REQUEST, workerMasterFilterSaga)
}
