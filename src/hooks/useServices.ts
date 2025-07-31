import { useState, useCallback } from "react";
import { apiService, ServiceRequest, UpdateServiceRequest } from "../services/api";
import type { CreateServiceResponse } from "../types/api-responses";
import type { Service } from "../services/api";

export const useServices = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [services, setServices] = useState<Service[]>([]);

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
    }, []);

    const getService = useCallback(async (serviceId: number): Promise<Service> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getService(serviceId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch service';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

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
    }, []);

    const updateService = useCallback(async (serviceId: number, data: UpdateServiceRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateService(serviceId, data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update service';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteService = useCallback(async (serviceId: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.deleteService(serviceId);
            // Update local services state by removing the deleted service
            setServices(prev => prev.filter(service => service.id !== serviceId));
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete service';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        services,
        getServices,
        getService,
        createService,
        updateService,
        deleteService,
        loading,
        error
    };
};