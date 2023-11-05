import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            token: null,
            currentUser: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        setToken: (state, action) => {
            // Lưu token trong trạng thái
            state.login.token = action.payload;
        },
        logOutSuccess: (state) => {
            state.login.token = null;
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
    },
});

export const { loginSuccess, logOutSuccess, setToken } = authSlice.actions;

export default authSlice.reducer;
