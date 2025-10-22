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

    // Helper to parse either numeric or string enum claims
    const parseEnumClaim = (val: any): number | null => {
        if (val === null || val === undefined) return null;
        // If it's already a number or numeric string, parse it
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
            // numeric string?
            const n = parseInt(val);
            if (!isNaN(n)) return n;
            // map known enum names to numeric values used by backend
            const map: Record<string, number> = {
                'SalonOwner': 2,
                'SalonStaff': 3,
                'Customer': 1,
                'StaffManager': 1,
                'Staff': 2
            };
            const normalized = val.trim();
            if (map[normalized] !== undefined) return map[normalized];
        }
        return null;
    };

    const userType = claims ? parseEnumClaim(claims['userType']) : null;
    const staffRole = claims ? parseEnumClaim(claims['staffRole']) : null;
    const staffId = claims ? (claims['staffId'] ? parseInt(claims['staffId']) : null) : null;
    const businessIdClaim = claims ? (claims['businessId'] ? parseInt(claims['businessId']) : null) : null;

    // Compute abilities from parsed claims. Keep constants in sync with backend enums.
    // ProfileType.SalonOwner == 2
    // SalonStaffRole.StaffManager == 1
    const isSalonOwner = userType === 2;
    const isStaffManager = staffRole === 1;
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