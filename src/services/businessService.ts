import axios from './axios';
import type {
    Business,
    CreateBusinessRequest,
    CreateBusinessResponse,
    UpdateBusinessRequest,
    UpdateBusinessResponse,
    Category
} from '../types/business';

export const businessService = {
    async createBusiness(data: CreateBusinessRequest): Promise<CreateBusinessResponse> {
        const response = await axios.post<CreateBusinessResponse>('/business', data);
        return response.data;
    },

    async updateBusiness(id: number, data: UpdateBusinessRequest): Promise<UpdateBusinessResponse> {
        const response = await axios.put<UpdateBusinessResponse>(`/business/${id}`, data);
        return response.data;
    },

    async getMyBusinesses(): Promise<Business[]> {
        const response = await axios.get<Business[]>('/business/my-businesses');
        return response.data;
    },

    async getCategories(activeOnly: boolean = true): Promise<Category[]> {
        const response = await axios.get<Category[]>('/business/getcategories', {
            params: { activeOnly }
        });
        return response.data;
    }
};