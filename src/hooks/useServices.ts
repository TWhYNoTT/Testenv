import { useState, useCallback } from "react";  // Add useCallback import
import { apiService, ServiceRequest } from "../services/api";
import type { CreateServiceResponse } from "../types/api-responses";
import type { Service } from "../services/api";

export const useServices = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [services, setServices] = useState<Service[]>([]);

    // Memoize with useCallback
    const getServices = useCallback(async (): Promise<Service[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getServices();
            setServices(response.services);
            return response.services;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch services';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);  // Empty dependency array

    // Memoize with useCallback
    const createService = useCallback(async (data: ServiceRequest): Promise<CreateServiceResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createService(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create service';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);  // Empty dependency array

    return {
        services,
        getServices,
        createService,
        loading,
        error
    };
};