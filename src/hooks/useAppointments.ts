import { useState, useCallback } from "react";
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

    const updateAppointment = useCallback(async (id: number, data: Omit<AppointmentRequest, 'businessId'>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateAppointment(id, data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update appointment';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteAppointment = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.deleteAppointment(id);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete appointment';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const rescheduleAppointment = useCallback(async (id: number, newDate: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.rescheduleAppointment(id, newDate);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to reschedule appointment';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const assignStaff = useCallback(async (appointmentId: number, staffId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.assignStaff(appointmentId, staffId);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to assign staff';
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

    const getAppointmentById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getAppointmentById(id);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch appointment';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createAppointment,
        getAppointmentById,
        updateAppointment,
        deleteAppointment,
        rescheduleAppointment,
        assignStaff,
        getAppointments,
        loading,
        error
    };
};