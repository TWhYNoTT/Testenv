// src/hooks/useAuth.ts
import { useState } from 'react';
import { apiService } from '../services/api';
import { ProfileType, Gender } from '../types/enums';
import { useAuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface LoginRequest {
    identifier: string;
    password: string;
    userType: ProfileType;
}

interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    countryCode?: string;
    gender?: Gender;
    termsAccepted: boolean;
    userType: ProfileType;
}

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setTokens } = useAuthContext();
    const { showToast } = useToast();

    const login = async (data: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.login(data);
            if (response.accessToken && response.refreshToken) {
                setTokens(response.accessToken, response.refreshToken);
                showToast('Successfully logged in', 'success');
            }
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            // showToast('An unexpected error occurred. Please try again.', 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.register({
                ...data,
                userType: ProfileType.SalonOwner // Since this is the salon owner portal
            });
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        register,
        loading,
        error
    };
};