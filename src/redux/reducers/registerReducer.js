import { actionType } from '../../shared/actionType';
import  defaultState  from '../store/defaultState'

const registerReducer = (state = defaultState.register, action) => {
  switch (action.type) {
    case actionType.REGISTER_REQUEST:
      return { registering: true };
    case actionType.REGISTER_SUCCESS:
      return {};
    case actionType.REGISTER_FAILURE:
      return {};
    default:
      return state
  }
}

export default registerReducer