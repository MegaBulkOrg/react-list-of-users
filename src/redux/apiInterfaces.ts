import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

export interface IUser {
    id: number
    name: string
    email: string
    phone: string
    avatar: string
    password: string
    role: string
    description: string
    liked: boolean
}

export interface INewUserRequest {
    name: string
    email: string
    phone: string
    avatar: string
    password: string
    role: string
    description: string
    liked: boolean
}

export interface IRegistration {
    name: string
    email: string
    password: string
}

interface IUpdateUserRequestBody {
    name: string
    email: string
    phone: string
    avatar: string
    password: string
    role: string
    description: string
}

export interface IUpdateUserArgs {
    id: number
    body: IUpdateUserRequestBody
}

export interface IUploadAvatarResponse {
  avatar: string;
}

export interface IGetNewAvatarPath {
    data?: IUploadAvatarResponse
    error?: FetchBaseQueryError | SerializedError
}