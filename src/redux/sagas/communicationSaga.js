import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';

function* workerToggleLockSaga(action) {
};

function* workerSelectDropdownSaga(action) {
};

function* workerGetRowDetailSaga(action) {
};

function* workerRemoveRowDetailSaga(action) {
};

function* workerAddMessageSaga(action) {
    yield put({ type: actionType.ADD_MESSAGE_SUCCESS, payload: action.payload })
};

function* workerAddLastMessageSaga(action) {
    yield put({ type: actionType.ADD_LAST_MESSAGE_SUCCESS, payload: action.payload })
};

function* workerRemoveLastMessageSaga(action) {
    yield put({ type: actionType.REMOVE_LAST_MESSAGE_SUCCESS })
};

function* workerAddSearchMessageSaga(action) {
    //for Demo
    // try {
    //     const elasticsearchData = yield call(() => axiosInstance.post('/comments/search', action.payload));
    //     yield put({ type: actionType.SEARCH_MESSAGE_SUCCESS, payload: { results: elasticsearchData.data.data.results, total: elasticsearchData.data.data.total, pageNo: action.payload.pageNo } });
    // } catch (e) {
    //     console.log("e ===>>>>", e);
    //     yield put({ type: actionType.SEARCH_MESSAGE_FAILURE });
    // }
};

function* workerGetNotificationSaga(action) {
    try {
        const notificationData = yield call(() => axiosInstance.get('/users/comments'));
        yield put({ type: actionType.GET_NOTIFICATION_SUCCESS, payload: notificationData.data.data.results });
    } catch (e) {
        yield put({ type: actionType.GET_NOTIFICATION_FAILURE });
    }
};

function* workerAddNotificationSaga(action) {
    try {
        yield put({ type: actionType.ADD_NOTIFICATION_SUCCESS, payload: action.payload });
    } catch (e) {
        yield put({ type: actionType.ADD_NOTIFICATION_FAILURE });
    }
};

export function* watcherCommunicationSaga() {
    yield takeLatest(actionType.TOGGLE_LOCK, workerToggleLockSaga)
    yield takeLatest(actionType.SELECT_DROPDOWN, workerSelectDropdownSaga)
    yield takeLatest(actionType.GET_ROW_DETAIL, workerGetRowDetailSaga)
    yield takeLatest(actionType.REMOVE_ROW_DETAIL, workerRemoveRowDetailSaga)

    yield takeLatest(actionType.ADD_MESSAGE_REQUEST, workerAddMessageSaga)
    yield takeLatest(actionType.ADD_LAST_MESSAGE_REQUEST, workerAddLastMessageSaga)
    yield takeLatest(actionType.REMOVE_LAST_MESSAGE_REQUEST, workerRemoveLastMessageSaga)
    yield takeLatest(actionType.SEARCH_MESSAGE_REQUEST, workerAddSearchMessageSaga)

    yield takeLatest(actionType.GET_NOTIFICATION_REQUEST, workerGetNotificationSaga)
    yield takeLatest(actionType.ADD_NOTIFICATION_REQUEST, workerAddNotificationSaga)
}
