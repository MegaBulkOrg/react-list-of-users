import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TAuth = {
    authorized: boolean;
    userId: number | null
}

const initialState: TAuth = {
    authorized: false,
    userId: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeAuthStatus(state, action: PayloadAction<TAuth>){
            state.authorized = action.payload.authorized
            state.userId = action.payload.userId
        },
    }
})

export const { changeAuthStatus } = authSlice.actions
export default authSlice.reducer