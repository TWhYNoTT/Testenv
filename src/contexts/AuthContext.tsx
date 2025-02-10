import React, { createContext, useContext, useState } from 'react';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refreshToken'));
    const { showToast } = useToast();
    const navigate = useNavigate();

    const setTokens = (newAccessToken: string, newRefreshToken: string) => {
        apiService.setTokens(newAccessToken, newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
    };

    const clearTokens = () => {
        apiService.clearTokens();
        setAccessToken(null);
        setRefreshToken(null);
        showToast('Your session has ended. Please login again.', 'info');
        navigate('/form/login');
    };

    return (
        <AuthContext.Provider value={{
            accessToken,
            refreshToken,
            setTokens,
            clearTokens,
            isAuthenticated: !!accessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext must be used within AuthProvider');
    return context;
};