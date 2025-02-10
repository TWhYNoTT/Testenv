import { useState } from "react";
import { apiService, AppointmentRequest, AppointmentListParams } from "../services/api";
import type { AppointmentResponse, AppointmentListResponse } from "../types/api-responses";

export const useAppointments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAppointment = async (data: AppointmentRequest): Promise<AppointmentResponse> => {
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
    };

    const getAppointments = async (params: AppointmentListParams): Promise<AppointmentListResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getAppointments(params);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch appointments';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        createAppointment,
        getAppointments,
        loading,
        error
    };
};
