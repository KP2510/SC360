import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'

const userReducer = (state = defaultState.users, action) => {
  switch (action.type) {
    case actionType.USER_SUCCESS:
      return {
        users: action.payload
      };
    case actionType.USER_FAILURE:
      return state;
    case actionType.USER_CREATE_SUCCESS:
      return {
        users: [...state.users, {...action.payload}]
      };
    case actionType.USER_CREATE_FAILURE:
      return state;
    case actionType.USER_UPDATE_SUCCESS: {
      const users = state.users.map(item => item.userID === action.user.userID ? {...action.payload, userID: action.user.userID } : item);
      return { users: [...users] };
    }
    case actionType.USER_UPDATE_FAILURE:
      return state;
    case actionType.USER_DELETE_SUCCESS: {
      const users = state.users.filter(item => item.userID !== action.payload);
      return { users: [...users] };
    }
    case actionType.USER_DELETE_FAILURE:
      return state;
    default:
      return state
  }
}

export default userReducer;