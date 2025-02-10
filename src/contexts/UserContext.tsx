import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user.interface';
import { apiService } from '../services/api';
import { authService } from '../services/auth.service';

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    refreshUser: () => Promise<void>;
    logout: (logoutFromAllDevices?: boolean) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUser = async () => {
        try {
            const userData = await apiService.getCurrentUser();
            setUser(userData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        setLoading(true);
        await fetchUser();
    };

    const logout = async (logoutFromAllDevices: boolean = false): Promise<boolean> => {
        const success = await authService.logout(logoutFromAllDevices);
        if (success) {
            setUser(null);
        }
        return success;
    };

    return (
        <UserContext.Provider value={{ user, loading, error, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
