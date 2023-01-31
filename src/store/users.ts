import axios from 'axios';
import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IUsersListElementProps } from 'Shared/UsersListElement';
import { RootState } from './store';

export const USERS_REQUEST = 'USERS_REQUEST'
export const USERS_REQUEST_SUCCESS = 'USERS_REQUEST_SUCCESS'
export const USERS_REQUEST_ERROR = 'USERS_REQUEST_ERROR'
// export const USERS_DELETE_ITEM = 'USERS_DELETE_ITEM'
// export const USERS_LIKE_ITEM = 'USERS_LIKE_ITEM'

export type UsersRequestAction = {
    type: typeof USERS_REQUEST
}
export type UsersRequestSuccessAction = {
    type: typeof USERS_REQUEST_SUCCESS
    users: IUsersListElementProps[]
}
export type UsersRequestErrorAction = {
    type: typeof USERS_REQUEST_ERROR
    error: string
}
// export type UsersDeleteItemAction = {
//     type: typeof USERS_DELETE_ITEM
//     id: string
// }
// export type UsersLikeItemAction = {
//     type: typeof USERS_LIKE_ITEM
//     id: string,
//     liked: boolean
// }

export const usersRequest: ActionCreator<UsersRequestAction> = () => ({
    type: USERS_REQUEST
})
export const usersRequestSuccess: ActionCreator<UsersRequestSuccessAction> = (users:IUsersListElementProps[]) => ({
    type: USERS_REQUEST_SUCCESS,
    users
})
export const usersRequestError: ActionCreator<UsersRequestErrorAction> = (error: string) => ({
    type: USERS_REQUEST_ERROR,
    error
})
// export const usersDeleteItem: ActionCreator<UsersDeleteItemAction> = (id: string) => ({
//     type: USERS_DELETE_ITEM,
//     id
// })
// export const usersLikeItem: ActionCreator<UsersLikeItemAction> = (id: string, liked: boolean) => ({
//     type: USERS_LIKE_ITEM,
//     id,
//     liked
// })

interface IUsers {
    id: string
    first_name: string
    last_name: string
    img: string
    email: string
    // liked: boolean
}

export const usersRequestAsync = (page:number): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch) => {
    dispatch(usersRequest())
    axios
        .get(`https://reqres.in/api/users?page=${page}&per_page=8`)
        .then(({ data: { data } }) => {
            // console.log(data)
            const usersToRedux = data.map((user: { [x: string]: any }): IUsers | null => {
                return {
                    id: user['id'],
                    first_name: user['first_name'],
                    last_name: user['last_name'],
                    img: user['avatar'],
                    email: user['email']
                    // liked: false
                }
            })
            dispatch(usersRequestSuccess(usersToRedux))
        })
        .catch((error) => {
            dispatch(usersRequestError(String(error)))
        })
}