import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'

const systemRoleReducer = (state = defaultState.systemRoles, action) => {
  switch (action.type) {
    case actionType.SYSTEM_ROLE_SUCCESS:
      const roles = action.payload && action.payload.map(item => {return {...item, value: item.sRoleID, label: item.sRole}})
      return {
        systemRoles: [...roles]
      };
    case actionType.SYSTEM_ROLE_FAILURE:
      return state;
    case actionType.SYSTEM_ROLE_CREATE_SUCCESS:
      return {
        systemRoles: [...state.systemRoles, {...action.payload}]
      };
    case actionType.SYSTEM_ROLE_CREATE_FAILURE:
      return state;
    case actionType.SYSTEM_ROLE_UPDATE_SUCCESS: {
      const systemRoles = state.systemRoles.map(item => item.sRoleID === action.systemRole.sRoleID ? {...action.payload, sRoleID: action.systemRole.sRoleID } : item);
      return { systemRoles: [...systemRoles] };
    }
    case actionType.SYSTEM_ROLE_UPDATE_FAILURE:
      return state;
    case actionType.SYSTEM_ROLE_DELETE_SUCCESS: {
      const systemRoles = state.systemRoles.filter(item => item.sRoleID !== action.payload);
      return { systemRoles: [...systemRoles] };
    }
    case actionType.SYSTEM_ROLE_DELETE_FAILURE:
      return state;
    default:
      return state
  }
}

export default systemRoleReducer;