import { Reducer } from "react";
import { IUserInfoProps } from 'Shared/pages/UserInfo';
import { CurrentUserRequestAction, CurrentUserRequestErrorAction, CurrentUserRequestSuccessAction, CURRENT_USER_REQUEST, CURRENT_USER_REQUEST_ERROR, CURRENT_USER_REQUEST_SUCCESS } from "./currentUser";

export type CurrentUserState = {
    loading: boolean
    error: string
    currentUserInfo: IUserInfoProps
}

type CurrentUserActions = CurrentUserRequestAction | CurrentUserRequestSuccessAction | CurrentUserRequestErrorAction

export const currentUserReducer: Reducer<CurrentUserState, CurrentUserActions> = (state, action) => {
    switch (action.type) {
        case CURRENT_USER_REQUEST:
            return {...state, loading: true}
        case CURRENT_USER_REQUEST_ERROR: 
            return {...state, error: action.error, loading: false}
        case CURRENT_USER_REQUEST_SUCCESS: 
            return {...state, currentUserInfo: action.currentUserInfo, loading: false}
        default:
            return state
    }
}