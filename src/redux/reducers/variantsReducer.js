import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState';
import { cloneDeep } from 'lodash';

const variantsReducer = (state = defaultState.variants, action) => {
  switch (action.type) {
    case actionType.VARIANTS_SUCCESS:
      let variants = state;
      variants[action.persID] = action.payload;
      return cloneDeep(variants);
    case actionType.VARIANTS_FAILURE:
      return state;
    default:
      return state
  }
}

export default variantsReducer;