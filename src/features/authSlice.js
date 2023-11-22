import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loginAdmin: {
            token: null,
            currentUser: null,
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.loginAdmin.isFetching = false;
            state.loginAdmin.currentUser = action.payload;
            state.loginAdmin.error = false;
        },
        setToken: (state, action) => {
            // Lưu token trong trạng thái
            state.loginAdmin.token = action.payload;
        },
        logOutSuccess: (state) => {
            state.loginAdmin.token = null;
            state.loginAdmin.isFetching = false;
            state.loginAdmin.currentUser = null;
            state.loginAdmin.error = false;
        },
    },
});

export const { loginSuccess, logOutSuccess, setToken } = authSlice.actions;

export default authSlice.reducer;
