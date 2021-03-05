import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import { login } from '../../utils/loginHelper';

function* workerLoginSaga(action) {
    try {
        const payload = yield login(action.cookies, action.payload)
        localStorage.setItem("logoutFlag", JSON.stringify({ logoutFlag: false }))
        localStorage.setItem("logoutTime", JSON.stringify({ logoutTime: null }))
        yield put({ type: actionType.LOGIN_SUCCESS, payload });
    } catch (e) {
        yield put({ type: actionType.LOGIN_FAILURE, payload: e.message });
        console.log("e:", e)
    }
};

function* workerLogoutSaga(action) {
    yield call(() => console.log("In workerLogoutSaga"))
};

export function* watcherLoginSaga() {
    yield takeLatest(actionType.LOGIN_REQUEST, workerLoginSaga)
    yield takeLatest(actionType.LOGOUT, workerLogoutSaga)
}
