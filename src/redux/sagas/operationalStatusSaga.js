import { call, put, takeLatest } from 'redux-saga/effects';
import { actionType } from '../../shared/actionType';
import axios from '../../utils/axios-instance';

import { orderBy } from 'lodash';

function* workerOperationalStatusSaga(action) {
    //console.log("action", action)
    try {
        const kpiRes = yield call(() => axios.get('/kpi'));
        const kpiResSorted = orderBy(kpiRes.data.data.Items, ['favourite', 'latest'], ['desc', 'desc']);
        yield put({ type: actionType.KPI_DATA_SUCCESS, payload: kpiResSorted });

        const geoRes = yield call(() => axios.get('/filters/geo'));
        const productLineRes = yield call(() => axios.get('/filters/productLine'));
        const skuRes = yield call(() => axios.get('/filters/sku'));
        const unitTypeRes = yield call(() => axios.get('/filters/unitType'));

        const payload = {
                dropDownValue: {
                    geo: geoRes.data.data.data,
                    unitType: unitTypeRes.data.data.data,
                    productLine: productLineRes.data.data.data,
                    sku: skuRes.data.data.data,
                },
                selectedValue: {
                    geo: geoRes.data.data.selected[0].value,
                    unitType: unitTypeRes.data.data.selected[0].value,
                    productLine: productLineRes.data.data.selected[0].value,
                    sku: skuRes.data.data.selected[0].value
                }
        };
        
        yield put({ type: actionType.OPERATIONAL_STATUS_SUCCESS, payload });

    } catch (e) {
        //yield put({ type: actionType.OPERATIONAL_STATUS_FAILURE, payload: e.message });
        console.log("e:", e)
    }
};


export function* watcherOperationalStatusSaga() {
    //console.log("watcherLoginSaga")
    yield takeLatest(actionType.OPERATIONAL_STATUS_REQUEST, workerOperationalStatusSaga)
}
