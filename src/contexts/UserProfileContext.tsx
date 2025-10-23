import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    profileType: string;
}

interface UserProfileContextType {
    profile: UserProfile | null;
    loading: boolean;
    error: Error | null;
    loadProfile: () => Promise<void>;
    updateProfile: (payload: { fullName: string; email: string; phoneNumber: string; countryCode: string }) => Promise<boolean>;
    changePassword: (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await apiService.getUserProfile();
            setProfile(data as UserProfile);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (payload: { fullName: string; email: string; phoneNumber: string; countryCode: string }) => {
        setLoading(true);
        try {
            const success = await apiService.updateUserProfile({
                userProfileId: profile?.id ?? 0,
                fullName: payload.fullName,
                email: payload.email,
                phoneNumber: payload.phoneNumber,
                countryCode: payload.countryCode
            });
            if (success) {
                // reload profile
                await loadProfile();
            }
            return success;
        } catch (err: any) {
            setError(err);
            // rethrow so caller can show detailed messages
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        setLoading(true);
        try {
            const success = await apiService.changePassword({
                userProfileId: profile?.id ?? 0,
                currentPassword: payload.currentPassword,
                newPassword: payload.newPassword,
                confirmPassword: payload.confirmPassword
            });
            return success;
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            loadProfile();
        }
    }, []);

    return (
        <UserProfileContext.Provider value={{ profile, loading, error, loadProfile, updateProfile, changePassword }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfileContext = () => {
    const ctx = useContext(UserProfileContext);
    if (!ctx) throw new Error('useUserProfileContext must be used within UserProfileProvider');
    return ctx;
};

export default UserProfileContext;
