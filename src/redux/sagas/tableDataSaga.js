import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axiosInstance from '../../utils/axios-instance';
import { constants } from '../../shared/constant';

function* workerTableDataSaga(action) {
    // ForDemo
    // try {
    //     const { id, jobRole, userGroupID } = action.payload.userInfo;
    //     const tableData = yield call(() => axiosInstance.get(`/sap/supplychain?persID=${constants.SKU}${jobRole.jobRoleID}${jobRole.position}${userGroupID[0]}&userID=${id}`));
    //     yield put({ type: actionType.TABLEDATA_SUCCESS, payload: tableData.data.data });
    // } catch (e) {
    //     yield put({ type: actionType.TABLEDATA_FAILURE });
    // }
};

export function* watcherTableDataSaga() {
    yield takeLatest(actionType.TABLEDATA_REQUEST, workerTableDataSaga)
}