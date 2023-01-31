import { Reducer } from "react";
import { IUsersListElementProps } from 'Shared/UsersListElement';
import { UsersRequestAction, UsersRequestErrorAction, UsersRequestSuccessAction, USERS_REQUEST, USERS_REQUEST_ERROR, USERS_REQUEST_SUCCESS } from "./users";

export type UsersState = {
    loading: boolean
    error: string
    items: IUsersListElementProps[]
}

type UsersActions = UsersRequestAction | UsersRequestSuccessAction | UsersRequestErrorAction

export const usersReducer: Reducer<UsersState, UsersActions> = (state, action) => {
    switch (action.type) {
        case USERS_REQUEST:
            return {...state, loading: true}
        case USERS_REQUEST_ERROR: 
            return {...state, error: action.error, loading: false}
        case USERS_REQUEST_SUCCESS: 
            return {...state, items: action.users, loading: false}
        // case USERS_LIKE_ITEM:
        //     const arrayWithLikedItem = state.users.filter((card: ICart) => card.id === action.id)
        //     const likedUsers = state.users.map(
        //         (item) => item.id === action.id ? {...arrayWithLikedItem[0], liked: action.liked} : item
        //     )
        //     return {...state, users: likedUsers}
        default:
            return state
    }
}