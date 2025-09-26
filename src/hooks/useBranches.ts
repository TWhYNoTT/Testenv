import { useState, useCallback } from "react";
import { apiService, CreateBranchRequest, UpdateBranchRequest } from "../services/api";
import type { BranchDto, BusinessBranchListResponse } from "../types/api-responses";

export const useBranches = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getBranches = useCallback(async (): Promise<BusinessBranchListResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getBranches();
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch branches';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchById = useCallback(async (id: number): Promise<BranchDto> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.getBranchById(id);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch branch';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const createBranch = useCallback(async (data: CreateBranchRequest): Promise<number> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.createBranch(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create branch';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBranch = useCallback(async (id: number, data: UpdateBranchRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.updateBranch(id, data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update branch';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBranch = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiService.deleteBranch(id);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete branch';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        getBranches,
        getBranchById,
        createBranch,
        updateBranch,
        deleteBranch,
        loading,
        error
    };
};