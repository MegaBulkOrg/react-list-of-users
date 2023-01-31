import { Reducer } from "redux";
import { AUTHORIZATION_STATUS } from "./authorization";
import { CURRENT_USER_REQUEST, CURRENT_USER_REQUEST_ERROR, CURRENT_USER_REQUEST_SUCCESS } from "./currentUser";
import { currentUserReducer, CurrentUserState } from "./currentUserReducer";
import { USERS_REQUEST, USERS_REQUEST_ERROR, USERS_REQUEST_SUCCESS } from "./users";
import { usersReducer, UsersState } from "./usersReducer";

export type RootState = {
  isAuthorized: boolean,
  users: UsersState,
  currentUser: CurrentUserState
}

const initialState: RootState = {
  isAuthorized: false,
  users: {loading: false, error: '', items: []},
  currentUser: {loading: false, error: '', currentUserInfo: {}}
}

export const rootReducer: Reducer<RootState> = (state = initialState, action) => {
    switch (action.type) {      
    case AUTHORIZATION_STATUS:
      return {...state, isAuthorized: action.status}
    case USERS_REQUEST:
    case USERS_REQUEST_ERROR: 
    case USERS_REQUEST_SUCCESS:
    // case USERS_LIKE_ITEM: 
      return {...state, users: usersReducer(state.users, action)}
    case CURRENT_USER_REQUEST:
    case CURRENT_USER_REQUEST_ERROR: 
    case CURRENT_USER_REQUEST_SUCCESS:
      return {...state, currentUser: currentUserReducer(state.currentUser, action)}
    default:
        return state
  }
}