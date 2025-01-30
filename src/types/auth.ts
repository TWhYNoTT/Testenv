import { Gender, ProfileType } from "./enums";

export interface LoginRequest {
    identifier: string;  // Email or Phone
    password: string;
    userType: ProfileType;
}

export interface LoginResponse {
    userId: number;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    countryCode?: string;
    gender?: Gender;
    termsAccepted: boolean;
    userType: ProfileType;
}

export interface RegisterResponse {
    userId: number;
    verificationToken: string;
}

export interface UserProfile {
    userId: number;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    countryCode?: string;
    userType: ProfileType;
    gender?: Gender;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    isVerified: boolean;
    lastLoginAt?: string;
}