export interface BusinessDetailsResponse {
    id: number;
    name: string;
    about: string;
    businessRegistrationNumber: string;
    isAlwaysOpen: boolean;
    isVerified: boolean;
    serviceType: string;
    location: {
        country: string;
        city: string;
        state: string;
        streetAddress: string;
        zipCode: string;
        hasHomeService: boolean;
        latitude: number;
        longitude: number;
    };
    businessHours: Array<{
        dayOfWeek: string;
        isOpen: boolean;
        openTime: string;
        closeTime: string;
        is24Hours: boolean;
    }>;
    categories: Array<{
        categoryId: number;
        name: string;
        isActive: boolean;
    }>;
}
