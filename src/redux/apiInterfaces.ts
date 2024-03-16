import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

export interface IAuthRequest {
    email: string
    password: string
}

export interface IAuthResponse {
    accessToken: string
    user: {
        email: string,
        id: number
    }
}

// для создания карточки с информацией о пользователе (там ID формируется автоматически)
export interface IUserCreate {
    user_id: number
    name: string
    phone: string
    avatar: string
    role: string
    description: string
}

// для вывода информации о пользователе (на странице пользователя и в списке) - там ID нужен для атрибута key
export interface IUserInfo {
    id: number
    user_id: number
    name: string
    phone: string
    avatar: string
    role: string
    description: string
}

// для вывода email на странице конкретного пользователя
export interface IUserAddInfoResponse {
    email: string
    password: string
    id: number
}

interface IUpdateUserRequestBody {
    name: string
    phone: string
    avatar: string
    role: string
    description: string
}
export interface IUpdateUserArgs {
    id: number
    body: IUpdateUserRequestBody
}

interface IUpdateUserEmailRequestBody {
    email: string
}
export interface IUpdateUserEmailArgs {
    id: number
    body: IUpdateUserEmailRequestBody
}

export interface IUploadAvatarResponse {
    avatar: string;
}
export interface IGetNewAvatarPath {
    data?: IUploadAvatarResponse
    error?: FetchBaseQueryError | SerializedError
}