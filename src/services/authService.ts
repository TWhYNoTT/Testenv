import axios from './axios';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UserProfile
} from '../types/auth';

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await axios.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },

    async getProfile(): Promise<UserProfile> {
        const response = await axios.get<UserProfile>('/auth/profile');
        return response.data;
    }
};