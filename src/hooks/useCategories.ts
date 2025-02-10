import { useState } from "react";
import { apiService, CategoryRequest } from "../services/api";
import type { CategoryListResponse, RequestCategoryResponse } from "../types/api-responses";

export const useCategories = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCategories = async (): Promise<CategoryListResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getCategories();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch categories';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getMyRequestedCategories = async (): Promise<CategoryListResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getMyRequestedCategories();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch requested categories';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getBusinessCategories = async (): Promise<CategoryListResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getBusinessCategories();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch business categories';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const requestCategory = async (data: CategoryRequest): Promise<RequestCategoryResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.requestCategory(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create category';
            const fullError = {
                message: errorMessage,
                response: err.response?.data,
                status: err.response?.status,
                details: err.response?.data?.details || err.response?.data?.errors
            };
            setError(errorMessage);
            throw fullError;
        } finally {
            setLoading(false);
        }
    };

    return {
        getCategories,
        getMyRequestedCategories,
        getBusinessCategories,
        requestCategory,
        loading,
        error
    };
};