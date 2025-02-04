import { useState } from "react";
import { apiService, CategoryRequest } from "../services/api";

// src/hooks/useCategories.ts
export const useCategories = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getCategories();
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getBusinessCategories = async (businessId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getBusinessCategories(businessId);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const requestCategory = async (data: CategoryRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.requestCategory(data);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        getCategories,
        getBusinessCategories,
        requestCategory,
        loading,
        error
    };
};