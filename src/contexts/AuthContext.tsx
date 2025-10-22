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
    // Parsed claims
    userType?: number | null;
    staffRole?: number | null;
    staffId?: number | null;
    businessId?: number | null;
    isSalonOwner: boolean;
    isStaffManager: boolean;
    canManageStaff: boolean;
    canDeleteStaff: boolean;
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

    // Helper to decode JWT payload
    const parseJwt = (token: string | null) => {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return decoded;
        } catch {
            return null;
        }
    };

    const claims = parseJwt(accessToken);
    const userType = claims ? (claims['userType'] ? parseInt(claims['userType']) : null) : null;
    const staffRole = claims ? (claims['staffRole'] ? parseInt(claims['staffRole']) : null) : null;
    const staffId = claims ? (claims['staffId'] ? parseInt(claims['staffId']) : null) : null;
    const businessIdClaim = claims ? (claims['businessId'] ? parseInt(claims['businessId']) : null) : null;

    const isSalonOwner = userType === 2; // ProfileType.SalonOwner == 2
    const isStaffManager = staffRole === 1; // SalonStaffRole.StaffManager == 1
    const canManageStaff = isSalonOwner || isStaffManager;
    const canDeleteStaff = isSalonOwner;

    return (
        <AuthContext.Provider value={{
            accessToken,
            refreshToken,
            setTokens,
            clearTokens,
            isAuthenticated: !!accessToken,
            userType,
            staffRole,
            staffId,
            businessId: businessIdClaim,
            isSalonOwner,
            isStaffManager,
            canManageStaff,
            canDeleteStaff
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