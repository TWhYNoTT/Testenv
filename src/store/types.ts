import { UserProfile } from '../types/auth';
import { Business, Category } from '../types/business';

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;
}

export interface BusinessState {
    businesses: Business[];
    categories: Category[];
    loading: boolean;
    error: string | null;
}