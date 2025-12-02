import { useState, useCallback } from "react";
import {
    apiService,
    CreateDiscountedDatePromoRequest,
    UpdateDiscountedDatePromoRequest,
    CreateServiceLevelPromoRequest,
    UpdateServiceLevelPromoRequest,
    CreateCouponPromoRequest,
    UpdateCouponPromoRequest,
    TogglePromotionRequest
} from "../services/api";
import type { PromotionDto, PromotionListResponse } from "../types/api-responses";

export const usePromotions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getPromotions = useCallback(async (): Promise<PromotionListResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getPromotions();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch promotions';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPromotionById = useCallback(async (id: number): Promise<PromotionDto> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getPromotionById(id);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch promotion';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Discounted Dates
    const createDiscountedDatePromo = useCallback(async (data: CreateDiscountedDatePromoRequest): Promise<number> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createDiscountedDatePromo(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create discounted date promotion';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDiscountedDatePromo = useCallback(async (id: number, data: UpdateDiscountedDatePromoRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateDiscountedDatePromo(id, data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update discounted date promotion';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Service Level Promo
    const createServiceLevelPromo = useCallback(async (data: CreateServiceLevelPromoRequest): Promise<number> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createServiceLevelPromo(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create service level promotion';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateServiceLevelPromo = useCallback(async (id: number, data: UpdateServiceLevelPromoRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateServiceLevelPromo(id, data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update service level promotion';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Coupon Promo
    const createCouponPromo = useCallback(async (data: CreateCouponPromoRequest): Promise<{ promotionId: number; couponCode: string }> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createCouponPromo(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create coupon promotion';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCouponPromo = useCallback(async (id: number, data: UpdateCouponPromoRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateCouponPromo(id, data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update coupon promotion';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Toggle & Delete
    const togglePromotion = useCallback(async (id: number, data: TogglePromotionRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.togglePromotion(id, data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to toggle promotion status';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePromotion = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.deletePromotion(id);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete promotion';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        // Get
        getPromotions,
        getPromotionById,
        // Discounted Dates
        createDiscountedDatePromo,
        updateDiscountedDatePromo,
        // Service Level
        createServiceLevelPromo,
        updateServiceLevelPromo,
        // Coupon
        createCouponPromo,
        updateCouponPromo,
        // Toggle & Delete
        togglePromotion,
        deletePromotion,
        // State
        loading,
        error
    };
};
