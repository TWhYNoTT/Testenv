export interface User {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    countryCode: string | null;
    userType: number;
    isVerified: boolean;
    createdAt: string;
    businessId: number | null;
}
