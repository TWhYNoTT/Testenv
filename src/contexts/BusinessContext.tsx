import React, { createContext, useContext, useState } from 'react';
import { useBusiness } from '../hooks/useBusiness';
import { ServiceType } from '../types/enums';
import type { BusinessRequest } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface BusinessHour {
    dayOfWeek: number;
    isOpen: boolean;
    is24Hours: boolean;
    openTime?: string;
    closeTime?: string;
}

interface BusinessData {
    businessName: string;
    about: string;
    businessRegistrationNumber: string;
    isAlwaysOpen: boolean;
    serviceType: ServiceType;
    categoryIds: string[];
    businessHours: BusinessHour[];
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
}

interface BusinessContextType {
    businessData: BusinessData;
    updateBusinessData: (data: Partial<BusinessData>) => void;
    loading: boolean;
    submitBusiness: () => Promise<void>;
    checkAndNavigate: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { createBusiness, checkBusinessExists, loading } = useBusiness();
    const navigate = useNavigate();

    const [businessData, setBusinessData] = useState<BusinessData>({
        businessName: '',
        about: '',
        businessRegistrationNumber: '',
        isAlwaysOpen: false,
        serviceType: ServiceType.Everyone,
        categoryIds: [],
        businessHours: Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i,
            isOpen: false,
            is24Hours: false,
            openTime: undefined,
            closeTime: undefined
        })),
        location: {
            country: '',
            city: '',
            state: '',
            streetAddress: '',
            zipCode: '',
            hasHomeService: false,
            latitude: 0,
            longitude: 0
        }
    });

    const validateBusinessData = (): boolean => {
        if (!businessData.businessName) {
            throw new Error('Business name is required');
        }
        if (!businessData.about) {
            throw new Error('Business description is required');
        }
        if (!businessData.categoryIds.length) {
            throw new Error('Please select at least one category');
        }
        if (!businessData.location.city) {
            throw new Error('City is required');
        }
        if (!businessData.location.country) {
            throw new Error('Country is required');
        }
        return true;
    };

    const transformToBusinessRequest = (data: BusinessData): BusinessRequest => {
        return {
            name: data.businessName,
            about: data.about,
            businessRegistrationNumber: data.businessRegistrationNumber,
            isAlwaysOpen: data.isAlwaysOpen,
            serviceType: data.serviceType,
            country: data.location.country,
            city: data.location.city,
            state: data.location.state,
            streetAddress: data.location.streetAddress,
            zipCode: data.location.zipCode,
            hasHomeService: data.location.hasHomeService,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            categoryIds: data.categoryIds.map(id => parseInt(id)),
            businessHours: data.businessHours.map(hour => ({
                ...hour,
                openTime: hour.openTime?.split(' ')[0],
                closeTime: hour.closeTime?.split(' ')[0]
            }))
        };
    };

    const submitBusiness = async () => {
        validateBusinessData();
        const requestData = transformToBusinessRequest(businessData);
        const response = await createBusiness(requestData);

        if (response) {
            navigate('/settings/accountsettings');
            return response;
        }
    };

    const updateBusinessData = (data: Partial<BusinessData>) => {
        setBusinessData(prev => ({
            ...prev,
            ...data
        }));
    };

    const checkAndNavigate = async () => {
        try {
            const business = await checkBusinessExists();
            if (business) {
                // After login, land on Dashboard as requested
                navigate('/');
            } else {
                // No business configured: guide through setup
                navigate('/wizard');
            }
        } catch (error) {
            console.error('Error checking business status:', error);
        }
    };

    return (
        <BusinessContext.Provider
            value={{
                businessData,
                updateBusinessData,
                loading,
                submitBusiness,
                checkAndNavigate
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
};

export const useBizContext = () => {
    const context = useContext(BusinessContext);
    if (context === undefined) {
        throw new Error('useBizContext must be used within a BusinessProvider');
    }
    return context;
};