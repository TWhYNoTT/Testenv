// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import { ErrorResponse } from '../types/api-errors';
import { CategoryListResponse, CreateServiceResponse, RequestCategoryResponse, LogoutResponse, AppointmentResponse, AppointmentListResponse, BusinessStaffListResponse, BranchDto, BusinessBranchListResponse } from '../types/api-responses';
import { User } from '../types/user.interface';
import { LogoutRequest } from './auth.service';
import { AppointmentStatus } from '../types/enums';

const API_BASE_URL = 'https://devanza-dev-backend.azurewebsites.net/api';

let toastService: { showToast: (message: string, type: 'error' | 'success' | 'info' | 'warning') => void } | null = null;

export const setToastService = (service: typeof toastService) => {
    toastService = service;
};

const ERROR_MESSAGES: Record<number, string> = {
    401: 'Your session has expired. Please login again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    500: 'An unexpected error occurred. Please try again later.',
};

const formatErrorMessage = (baseMessage: string, errors?: Record<string, string[]>): string => {
    if (!errors) return baseMessage;

    const errorMessages = Object.values(errors)
        .flat()
        .filter(msg => msg && msg.length > 0);

    if (errorMessages.length === 0) return baseMessage;

    return `${baseMessage}: ${errorMessages.join('. ')}`;
};

// Types
export interface LoginRequest {
    identifier: string;
    password: string;
    userType: 1 | 2;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    countryCode?: string;
    gender?: 1 | 2;
    termsAccepted: boolean;
    userType: 1 | 2;
}

export interface BusinessRequest {
    name: string;
    about: string;
    businessRegistrationNumber?: string;
    isAlwaysOpen: boolean;
    serviceType: 1 | 2 | 3;
    city: string;
    state: string;
    streetAddress: string;
    zipCode: string;
    hasHomeService: boolean;
    latitude?: number;
    longitude?: number;
    country: string;
    businessHours: Array<{
        dayOfWeek: number;
        isOpen: boolean;
        openTime?: string;
        closeTime?: string;
        is24Hours: boolean;
    }>;
    categoryIds: number[];
}

export interface CategoryRequest {
    name: string;
    image?: File;
}

export interface ServicePricingOptionDto {
    name: string;
    price: number;
    currency: string;
    duration: string;
}

export interface ServiceRequest {
    categoryId: number;
    name: string;
    image?: File;
    minDuration: string;
    maxDuration: string;
    serviceType: number;
    hasHomeService: boolean;
    description?: string;
    pricingOptions: ServicePricingOptionDto[];
}

export interface UpdateServiceRequest {
    name: string;
    image?: File;
    removeExistingImage: boolean;
    minDuration: string;
    maxDuration: string;
    serviceType: number;
    hasHomeService: boolean;
    description?: string;
    isActive: boolean;
    pricingOptions: ServicePricingOptionDto[];
}

export interface VerifyAccountRequest {
    userId: number;
    userType: number;
    verificationToken: string;
}

export interface Service {
    id: number;
    name: string;
    imageUrl: string;
    minDuration: string;
    maxDuration: string;
    serviceType: number;
    hasHomeService: boolean;
    description: string;
    categoryName: string;
    isActive: boolean;
    pricingOptions: Array<{
        name: string;
        price: number;
        currency: string;
        duration: string;
    }>;
}

export interface ServiceListResponse {
    services: Service[];
    totalCount: number;
}

export interface AppointmentRequest {
    businessId: number;
    clientName: string;
    mobileNumber: string;
    email: string;
    categoryId: number;
    serviceId: number;
    pricingOptionId: number;
    amount: number;
    staffId?: number | null;  // Optional to match backend
    paymentStatus: number;
    appointmentDate: string;  // Ensure format is correct (YYYY-MM-DDTHH:MM:SS)
    isDraft: boolean;
    notes?: string;
}

export interface AppointmentListParams {
    startDate?: string;         // Changed from fromDate
    endDate?: string;           // Changed from toDate
    paymentStatus?: number;     // Changed from status
    categoryId?: number;        // Added to match backend
    page?: number;              // Changed from pageNumber
    pageSize?: number;
}

export interface RegisterStaffRequest {
    businessId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    position?: string;
    isActive: boolean;
}

export interface StaffListParams {
    businessId: number;
    page?: number;
    pageSize?: number;
}

export interface CreateBranchRequest {
    name: string;
    address: string;
    primaryHeadQuarter: boolean;
    active: boolean;
    description: string;
}

export interface UpdateBranchRequest {
    id: number;
    name: string;
    address: string;
    primaryHeadQuarter: boolean;
    active: boolean;
    description: string;
}

class ApiService {
    private axiosInstance: AxiosInstance;
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor for authentication
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling and token refresh
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config; console.log(error)
                // Handle token refresh
                if (error.response?.status === 401 && error.response?.data.message !== 'Login failed' && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        return new Promise(resolve => {
                            this.refreshSubscribers.push((token: string) => {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                                resolve(this.axiosInstance(originalRequest));
                            });
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        const response = await this.refreshAccessToken(refreshToken!);
                        const { accessToken, refreshToken: newRefreshToken } = response.data;

                        this.setTokens(accessToken, newRefreshToken);
                        this.onRefreshSuccess(accessToken);

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return this.axiosInstance(originalRequest);
                    } catch (refreshError) {
                        this.clearTokens();
                        this.onRefreshFailure(refreshError);
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                // Handle other errors with toast notifications
                if (toastService) {
                    const errorResponse = error.response?.data as ErrorResponse;
                    const statusCode = error.response?.status;
                    const detailedMessage = formatErrorMessage(
                        errorResponse?.message || 'Invalid request',
                        errorResponse?.errors
                    );
                    switch (statusCode) {
                        case 400:

                            toastService.showToast(detailedMessage, 'error');
                            break;

                        case 401:
                        case 403:
                        case 404:
                        case 500:
                            toastService.showToast(
                                errorResponse?.message ? detailedMessage : ERROR_MESSAGES[statusCode],
                                'error'
                            );
                            break;

                        default:
                            if (error.message === 'Network Error') {
                                toastService.showToast(
                                    'Unable to connect to server. Please check your internet connection.',
                                    'error'
                                );
                            } else {
                                toastService.showToast('An unexpected error occurred', 'error');
                            }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private onRefreshSuccess(token: string) {
        this.refreshSubscribers.forEach(callback => callback(token));
        this.refreshSubscribers = [];
    }

    private onRefreshFailure(error: any) {
        this.refreshSubscribers = [];
    }

    setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete this.axiosInstance.defaults.headers.common['Authorization'];
    }

    public async refreshAccessToken(refreshToken: string) {
        return await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    }

    // Auth APIs
    async login(data: LoginRequest) {
        const response = await this.axiosInstance.post('/auth/login', data);
        if (response.data.accessToken && response.data.refreshToken) {
            this.setTokens(response.data.accessToken, response.data.refreshToken);
        }
        return response.data;
    }

    async register(data: RegisterRequest) {
        const response = await this.axiosInstance.post('/auth/register', data);
        return response.data;
    }

    async verifyAccount(data: VerifyAccountRequest) {
        const response = await this.axiosInstance.post('/Auth/verify', data);
        return response.data;
    }

    async logout(data: LogoutRequest): Promise<LogoutResponse> {
        const response = await this.axiosInstance.post('/Auth/logout', data);
        return response.data;
    }

    // Business APIs
    async createBusiness(data: BusinessRequest) {
        const response = await this.axiosInstance.post('/business', data);
        return response.data;
    }

    async getMyBusiness() {
        const response = await this.axiosInstance.get('/business/my-business');
        return response.data;
    }

    async getCategories() {
        const response = await this.axiosInstance.get('/category');
        return response.data;
    }

    async getBusinessCategories(): Promise<CategoryListResponse> {
        const response = await this.axiosInstance.get('/category/business');
        return response.data;
    }

    async getMyRequestedCategories(): Promise<CategoryListResponse> {
        const response = await this.axiosInstance.get('/category/my-requests');
        return response.data;
    }

    // Category APIs
    async requestCategory(data: CategoryRequest): Promise<RequestCategoryResponse> {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.image) {
            formData.append('image', data.image);
        }

        const response = await this.axiosInstance.post(
            '/category/request',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    async removeCategoryFromBusiness(categoryId: number): Promise<boolean> {
        const response = await this.axiosInstance.delete(`/category/business/${categoryId}`);
        return response.status === 200;
    }

    // Service APIs
    async createService(data: ServiceRequest): Promise<CreateServiceResponse> {
        const formData = new FormData();

        // Add PricingOptionsJson as stringified array
        formData.append('PricingOptionsJson', JSON.stringify(data.pricingOptions));

        // Add other fields in exact order and format
        formData.append('MinDuration', data.minDuration);
        formData.append('Name', data.name);
        formData.append('ServiceType', data.serviceType.toString());
        formData.append('MaxDuration', data.maxDuration);
        formData.append('CategoryId', data.categoryId.toString());

        // Add image if exists
        if (data.image) {
            formData.append('Image', data.image);
        }

        formData.append('HasHomeService', data.hasHomeService.toString());

        if (data.description) {
            formData.append('Description', data.description);
        }

        const response = await this.axiosInstance.post(
            '/service',
            formData,
            {
                headers: {

                    'accept': 'text/plain'

                }
            }
        );
        return response.data;
    }

    async getServices(): Promise<ServiceListResponse> {
        const response = await this.axiosInstance.get('/service');
        return response.data;
    }

    async getService(serviceId: number): Promise<Service> {
        const response = await this.axiosInstance.get(`/service/${serviceId}`);
        return response.data;
    }

    async updateService(serviceId: number, data: UpdateServiceRequest): Promise<boolean> {
        const formData = new FormData();

        formData.append('Name', data.name);
        formData.append('MinDuration', data.minDuration);
        formData.append('MaxDuration', data.maxDuration);
        formData.append('ServiceType', data.serviceType.toString());
        formData.append('HasHomeService', data.hasHomeService.toString());
        formData.append('IsActive', data.isActive.toString());
        formData.append('RemoveExistingImage', data.removeExistingImage.toString());
        formData.append('PricingOptionsJson', JSON.stringify(data.pricingOptions));

        if (data.image) {
            formData.append('Image', data.image);
        }
        if (data.description) {
            formData.append('Description', data.description);
        }

        const response = await this.axiosInstance.put(`/service/${serviceId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.status === 200;
    }

    async deleteService(serviceId: number): Promise<boolean> {
        const response = await this.axiosInstance.delete(`/service/${serviceId}`);
        return response.status === 200;
    }

    // User APIs
    async getCurrentUser(): Promise<User> {
        const response = await this.axiosInstance.get('/Auth/me');
        return response.data;
    }

    // Appointment APIs
    async createAppointment(data: AppointmentRequest): Promise<AppointmentResponse> {
        const response = await this.axiosInstance.post('/salon-owner/appointments', data);
        return response.data;
    }

    async getAppointments(params: AppointmentListParams): Promise<AppointmentListResponse> {
        const queryParams = new URLSearchParams();

        // Use the correct parameter names expected by your backend
        if (params.startDate) {
            queryParams.append('startDate', params.startDate);
        }

        if (params.endDate) {
            queryParams.append('endDate', params.endDate);
        }

        if (params.paymentStatus !== undefined) {
            queryParams.append('paymentStatus', params.paymentStatus.toString());
        }

        if (params.categoryId !== undefined) {
            queryParams.append('categoryId', params.categoryId.toString());
        }

        if (params.page) {
            queryParams.append('page', params.page.toString());
        }

        if (params.pageSize) {
            queryParams.append('pageSize', params.pageSize.toString());
        }

        const response = await this.axiosInstance.get(`/salon-owner/appointments?${queryParams.toString()}`);
        return response.data;
    }

    async registerStaff(data: RegisterStaffRequest): Promise<number> {
        const response = await this.axiosInstance.post('/salon-staff/register', data);
        return response.data;
    }

    async getBusinessStaff(params: StaffListParams): Promise<BusinessStaffListResponse> {
        const queryParams = new URLSearchParams();

        queryParams.append('businessId', params.businessId.toString());

        if (params.page) {
            queryParams.append('page', params.page.toString());
        }

        if (params.pageSize) {
            queryParams.append('pageSize', params.pageSize.toString());
        }

        const response = await this.axiosInstance.get(`/salon-staff?${queryParams.toString()}`);
        return response.data;
    }

    async deleteStaff(staffId: number): Promise<boolean> {
        const response = await this.axiosInstance.delete(`/salon-staff/${staffId}`);
        return response.data.success;
    }

    // Branch APIs
    async getBranches(): Promise<BusinessBranchListResponse> {
        const response = await this.axiosInstance.get('/salon-owner/branches');
        return response.data;
    }

    async getBranchById(id: number): Promise<BranchDto> {
        const response = await this.axiosInstance.get(`/salon-owner/branches/${id}`);
        return response.data;
    }

    async createBranch(data: CreateBranchRequest): Promise<number> {
        const response = await this.axiosInstance.post('/salon-owner/branches', data);
        return response.data;
    }

    async updateBranch(id: number, data: UpdateBranchRequest): Promise<boolean> {
        const response = await this.axiosInstance.put(`/salon-owner/branches/${id}`, data);
        return response.data;
    }

    async deleteBranch(id: number): Promise<boolean> {
        const response = await this.axiosInstance.delete(`/salon-owner/branches/${id}`);
        return response.data;
    }
}

export const apiService = new ApiService();