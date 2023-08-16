import { Reducer } from "redux";
import { CURRENT_USER_REQUEST, CURRENT_USER_REQUEST_ERROR, CURRENT_USER_REQUEST_SUCCESS } from "./currentUser";
import { CurrentUserState, currentUserReducer } from "./currentUserReducer";
import { USERS_REQUEST, USERS_REQUEST_ERROR, USERS_REQUEST_SUCCESS } from "./users";
import { UsersState, usersReducer } from "./usersReducer";

export type RootState = {
  users: UsersState,
  currentUser: CurrentUserState
}

const initialState: RootState = {
  users: {loading: false, error: '', items: []},
  currentUser: {loading: false, error: '', currentUserInfo: {}}
}

export const rootReducer: Reducer<RootState> = (state = initialState, action) => {
    switch (action.type) {
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