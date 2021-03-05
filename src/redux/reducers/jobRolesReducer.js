import { actionType } from '../../shared/actionType';
import defaultState from '../store/defaultState'

const jobRoleReducer = (state = defaultState.jobRoles, action) => {
  switch (action.type) {
    case actionType.JOB_ROLE_SUCCESS:
      const roles = action.payload && action.payload.map(item => {return {...item, value: item.jobRoleID, label: item.jobRole}})
      return {
        jobRoles: [...roles]
      };
    case actionType.JOB_ROLE_FAILURE:
      return state;
    case actionType.JOB_ROLE_CREATE_SUCCESS:
      return {
        jobRoles: [...state.jobRoles, {...action.payload}]
      };
    case actionType.JOB_ROLE_CREATE_FAILURE:
      return state;
    case actionType.JOB_ROLE_UPDATE_SUCCESS: {
      const jobRoles = state.jobRoles.map(item => item.jobRoleId === action.jobRole.jobRoleID ? {...action.payload, jobRoleID: action.jobRole.jobRoleID } : item);
      return { jobRoles: [...jobRoles] };
    }
    case actionType.JOB_ROLE_UPDATE_FAILURE:
      return state;
    case actionType.JOB_ROLE_DELETE_SUCCESS: {
      const jobRoles = state.jobRoles.filter(item => item.jobRoleID !== action.payload);
      return { jobRoles: [...jobRoles] };
    }
    case actionType.JOB_ROLE_DELETE_FAILURE:
      return state;
    default:
      return state
  }
}

export default jobRoleReducer;