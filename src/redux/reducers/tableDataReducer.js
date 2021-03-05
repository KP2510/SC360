import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState';
import { cloneDeep } from 'lodash';

const tableDataReducer = (state = defaultState.tableData, action) => {
  switch (action.type) {
    case actionType.TABLEDATA_SUCCESS:
      return cloneDeep(action.payload);
    case actionType.TABLEDATA_FAILURE:
      return state;
    default:
      return state
  }
}

export default tableDataReducer;