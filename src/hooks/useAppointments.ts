import { useState, useCallback } from "react";  // Add useCallback import
import { apiService, AppointmentRequest, AppointmentListParams } from "../services/api";
import type { AppointmentResponse, AppointmentListResponse } from "../types/api-responses";


export const useAppointments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAppointment = useCallback(async (data: AppointmentRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createAppointment(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create appointment';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const getAppointments = useCallback(async (params: AppointmentListParams) => {
        setLoading(true);
        setError(null);
        try {
            // Rename parameters to match backend
            const apiParams = {

                startDate: params.startDate,
                endDate: params.endDate,
                paymentStatus: params.paymentStatus,
                categoryId: params.categoryId,
                page: params.page || 1,
                pageSize: params.pageSize || 10
            };

            const response = await apiService.getAppointments(apiParams);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch appointments';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createAppointment,
        getAppointments,
        loading,
        error
    };
};