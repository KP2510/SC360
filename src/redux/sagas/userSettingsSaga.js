import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';

function* workerUserSettingsSaga(action) {
    try {
        const userSettingsData = yield call(() => axiosInstance.get('/userSettings'));
        yield put({ type: actionType.USER_SETTINGS_SUCCESS, payload: userSettingsData.data.data });
    } catch (e) {
        console.log("Error in userSettings saga:", e)
    }
};

function* workerDashboardUpdateSaga(action) {
    try {
        const dashboardUpdateData = yield call(() => axiosInstance.put('/updateSettings', action.payload));
        const payload = { dashboards: dashboardUpdateData.data.data.Attributes.cardsVisible }
        yield put({ type: actionType.USER_SETTINGS_UPDATE_SUCCESS, payload: { key: "dashboards", data: payload } });
    } catch (e) {
        console.log("Error in userSettings saga:", e)
    }
};

function* workerReportsUpdateSaga(action) {

};

function* workerAccountUpdateSaga(action) {
    try {
        const accountUpdateData = yield call(() => axiosInstance.put('/updateSettings', action.payload));
        yield put({ type: actionType.USER_SETTINGS_UPDATE_SUCCESS, payload: { key: "accountSettings", data: accountUpdateData.data.data.Attributes } });
    } catch (e) {
        console.log("Error in userSettings saga:", e)
    }
};

export function* watcherUserSettingsSaga() {
    yield takeLatest(actionType.USER_SETTINGS_REQUEST, workerUserSettingsSaga)
    yield takeLatest(actionType.USER_SETTINGS_UPDATE_DASHBOARD, workerDashboardUpdateSaga)
    yield takeLatest(actionType.USER_SETTINGS_UPDATE_REPORTS, workerReportsUpdateSaga)
    yield takeLatest(actionType.USER_SETTINGS_UPDATE_ACCOUNT, workerAccountUpdateSaga)
}
