// src/hooks/useBusiness.ts
import { useState, useCallback } from "react";
import { apiService, BusinessRequest } from "../services/api";
import type { BusinessDetailsResponse } from "../types/api-responses";

export const useBusiness = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Memoize with useCallback
    const createBusiness = useCallback(async (data: BusinessRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createBusiness(data);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Memoize with useCallback
    const checkBusinessExists = useCallback(async (): Promise<BusinessDetailsResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getMyBusiness();
            return response;
        } catch (err: any) {
            if (err.response?.status === 404) {
                return null;
            }
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createBusiness,
        checkBusinessExists,
        loading,
        error
    };
};