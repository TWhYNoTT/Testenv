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

export interface Category {
    id: number;
    name: string;
    imageUrl: string;
    isActive: boolean;
    approvalStatus: number;
}

export interface CategoryListResponse {
    categories: Category[];
    totalCount: number;
}

export interface RequestCategoryResponse {
    categoryId: number;
    name: string;
    approvalStatus: number;
}

export interface ServicePricingOption {
    name: string;
    price: number;
    currency: string;
    duration: string;
}

export interface CreateServiceResponse {
    serviceId: number;
    name: string;
    pricingOptions: ServicePricingOption[];
}

export interface LogoutResponse {
    success: boolean;
}

export interface AppointmentResponse {
    id: number;
    clientName: string;
    mobileNumber: string;
    email: string;
    serviceId: number;
    amount: number;
    appointmentDate: string;
    appointmentTime: string;
    isDraft: boolean;
    status: string;
}
