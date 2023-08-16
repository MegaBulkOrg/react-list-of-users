import { IUserInfoProps } from 'Shared/pages/UserInfo';
import axios from 'axios';
import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';

export const CURRENT_USER_REQUEST = 'CURRENT_USER_REQUEST'
export const CURRENT_USER_REQUEST_SUCCESS = 'CURRENT_USER_REQUEST_SUCCESS'
export const CURRENT_USER_REQUEST_ERROR = 'CURRENT_USER_REQUEST_ERROR'

export type CurrentUserRequestAction = {
    type: typeof CURRENT_USER_REQUEST
}
export type CurrentUserRequestSuccessAction = {
    type: typeof CURRENT_USER_REQUEST_SUCCESS
    currentUserInfo: IUserInfoProps
}
export type CurrentUserRequestErrorAction = {
    type: typeof CURRENT_USER_REQUEST_ERROR
    error: string
}

export const currentUserRequest: ActionCreator<CurrentUserRequestAction> = () => ({
    type: CURRENT_USER_REQUEST
})
export const currentUserRequestSuccess: ActionCreator<CurrentUserRequestSuccessAction> = (currentUserInfo:IUserInfoProps) => ({
    type: CURRENT_USER_REQUEST_SUCCESS,
    currentUserInfo
})
export const currentUserRequestError: ActionCreator<CurrentUserRequestErrorAction> = (error: string) => ({
    type: CURRENT_USER_REQUEST_ERROR,
    error
})

interface ICurrentUser {
    id: string
    first_name: string
    last_name: string
    img: string
    email: string
    // liked: boolean
}

export const currentUserRequestAsync = (id:string | undefined): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch) => {
    dispatch(currentUserRequest())
    axios
        .get(`https://reqres.in/api/users/${id}`)
        .then(({ data: { data } }) => {
            // console.log(data)
            dispatch(currentUserRequestSuccess(data))
        })
        .catch((error) => {
            dispatch(currentUserRequestError(String(error)))
        })
}