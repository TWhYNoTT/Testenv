// src/hooks/useStaff.ts
import { useState, useCallback } from "react";
import { apiService, RegisterStaffRequest, StaffListParams } from "../services/api";
import type { BusinessStaffDto, BusinessStaffListResponse } from "../types/api-responses";

export const useStaff = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [staff, setStaff] = useState<BusinessStaffDto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const getBusinessStaff = useCallback(async (params: StaffListParams): Promise<BusinessStaffListResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getBusinessStaff(params);
            setStaff(response.staff);
            setTotalCount(response.totalCount);
            setCurrentPage(response.page);
            setTotalPages(response.totalPages);
            setPageSize(response.pageSize);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch staff';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const registerStaff = useCallback(async (data: RegisterStaffRequest): Promise<number> => {
        setLoading(true);
        setError(null);
        try {
            const staffId = await apiService.registerStaff(data);
            return staffId;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to register staff';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteStaff = useCallback(async (staffId: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const success = await apiService.deleteStaff(staffId);
            return success;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete staff';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        staff,
        totalCount,
        currentPage,
        totalPages,
        pageSize,
        getBusinessStaff,
        registerStaff,
        deleteStaff,
        loading,
        error
    };
};