import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'

const userGroupReducer = (state = defaultState.userGroups, action) => {
  switch (action.type) {
    case actionType.USER_GROUP_SUCCESS:
      return {
        userGroups: action.payload
      };
    case actionType.USER_GROUP_FAILURE:
      return state;
    case actionType.USER_GROUP_CREATE_SUCCESS:
      return {
        userGroups: [...state.userGroups, { ...action.payload }]
      };
    case actionType.USER_GROUP_CREATE_FAILURE:
      return state;
    case actionType.USER_GROUP_DELETE_SUCCESS:
      const userGroups = state.userGroups.filter(item => item.userGroupID !== action.payload);
      return { userGroups: [...userGroups] };
    case actionType.USER_GROUP_DELETE_FAILURE:
      return state;
    case actionType.UG_ADD_USER_SUCCESS: {
      const userGroup = state.userGroups.find(item => action.payload.userGroupID === item.userGroupID);

      if (userGroup && userGroup.users) {
        userGroup.users.push({ ...action.user });
      }

      return {
        userGroups: [...state.userGroups]
      };
    }
    case actionType.UG_ADD_USER_FAILURE:
      return state;
    case actionType.UG_DELETE_USER_SUCCESS: {
      const userGroup = state.userGroups.find(item => action.payload.userGroupID === item.userGroupID);

      const users = userGroup.users && userGroup.users.filter(item => item.userID !== action.user.userID);
      userGroup.users = users;

      return {
        userGroups: [...state.userGroups]
      };
    }
    case actionType.UG_DELETE_USER_FAILURE:
      return state;
    default:
      return state
  }
}

export default userGroupReducer;