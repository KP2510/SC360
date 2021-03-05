import { actionType } from "../../shared/actionType";
import defaultState from "../store/defaultState";
import { updateObject } from "../../utils/helper";

const loginReducer = (state = defaultState.login, action) => {
  switch (action.type) {
    case actionType.LOGIN_SUCCESS:
      return updateObject(state, {
        userInfo: action.payload,
      });
    case actionType.LOGIN_FAILURE:
      return state;
    case actionType.LOGOUT:
      return state;
    case actionType.SAVE_CREDENTIALS:
      return updateObject(state, {
        userName: action.payload.encryptedUserName,
        password: action.payload.encryptedPassword,
      });
    default:
      return state;
  }
};

export default loginReducer;
