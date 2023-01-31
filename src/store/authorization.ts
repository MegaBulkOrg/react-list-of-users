import { ActionCreator } from 'redux';

export const AUTHORIZATION_STATUS = 'AUTHORIZATION_STATUS'

export type AuthorizationStatusAction = {
    type: typeof AUTHORIZATION_STATUS
    status: boolean
}

export const authorizationStatus: ActionCreator<AuthorizationStatusAction> = (status:boolean) => ({
    type: AUTHORIZATION_STATUS,
    status
})