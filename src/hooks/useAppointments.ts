import { useState } from "react";
import { apiService, AppointmentRequest } from "../services/api";
import type { AppointmentResponse } from "../types/api-responses";

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

    return {
        createAppointment,
        loading,
        error
    };
};
