import { call, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';

function* workerJoyRideSaga(action) {
    console.log("action in workerJoyRideSaga::", action)
    yield call(() => console.log("In workerJoyRideSaga"));
};


export function* watcherJoyRideSaga() {
    //console.log("watcherLoginSaga")
    yield takeLatest(actionType.RUN_TOUR, workerJoyRideSaga)
}
