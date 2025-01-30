import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types/auth';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: UserProfile | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
        },
        setUser: (state, action: PayloadAction<UserProfile>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;