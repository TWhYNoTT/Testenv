import { ServiceType } from "./enums";

export interface BusinessLocation {
    city: string;
    state: string;
    streetAddress: string;
    zipCode: string;
    hasHomeService: boolean;
    latitude?: number;
    longitude?: number;
}

export interface BusinessHours {
    dayOfWeek: number;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    is24Hours: boolean;
}

export interface ServicePricingOption {
    id: number;
    name: string;
    price: number;
    currency: string;
    duration: string; // ISO Duration string
}

export interface BusinessService {
    id: number;
    name: string;
    description?: string;
    minDuration: string; // ISO Duration string
    maxDuration: string; // ISO Duration string
    isActive: boolean;
    serviceType: ServiceType;
    hasHomeService: boolean;
    pricingOptions: ServicePricingOption[];
}

export interface BusinessCategory {
    id: number;
    businessId: number;
    categoryId: number;
    categoryName: string;
    isActive: boolean;
    services: BusinessService[];
}

export interface Business {
    id: number;
    name: string;
    about: string;
    businessRegistrationNumber?: string;
    isAlwaysOpen: boolean;
    isVerified: boolean;
    verifiedAt?: string;
    serviceType: ServiceType;
    location?: BusinessLocation;
    businessHours: BusinessHours[];
    categories: BusinessCategory[];
}

export interface CreateBusinessRequest {
    name: string;
    about: string;
    businessRegistrationNumber?: string;
    isAlwaysOpen: boolean;
    serviceType: ServiceType;
    location: BusinessLocation;
    businessHours: BusinessHours[];
    categoryIds: number[];
}

export interface CreateBusinessResponse {
    businessId: number;
}

export interface UpdateBusinessRequest extends CreateBusinessRequest {
    businessId: number;
}

export interface UpdateBusinessResponse {
    businessId: number;
    updated: boolean;
}

export interface Category {
    id: number;
    name: string;
    imageUrl?: string;
    isActive: boolean;
}

export interface CategoryResponse {
    id: number;
    name: string;
    imageUrl?: string | null;
    isActive: boolean;
}
