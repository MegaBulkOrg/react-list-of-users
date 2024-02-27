import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TAuth = {
    accessToken?: string | null
    authedUserId?: number | null
    regToken?: string | null
}

const initialState: TAuth = {
    accessToken: null,
    authedUserId: null,
    regToken: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeAuthStatus(state, action: PayloadAction<TAuth>){
            state.accessToken = action.payload.accessToken
            state.authedUserId = action.payload.authedUserId
        },
        changeRegStatus(state, action: PayloadAction<TAuth>){
            state.regToken = action.payload.regToken
        }
    }
})

export const { changeAuthStatus, changeRegStatus } = authSlice.actions
export default authSlice.reducer