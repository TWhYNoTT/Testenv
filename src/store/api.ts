import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export const devanzaApi = createApi({
    reducerPath: 'devanzaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://devanza.runasp.net/api/',
        prepareHeaders: (headers, { getState }) => {
            // Get token from Redux state instead of localStorage
            const token = (getState() as RootState).auth.accessToken;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Profile', 'Business', 'Category'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: 'auth/register',
                method: 'POST',
                body: data,
            }),
        }),
        getProfile: builder.query({
            query: () => 'auth/profile',
            providesTags: ['Profile'],
        }),
        createBusiness: builder.mutation({
            query: (data) => ({
                url: 'business',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Business'],
        }),
        updateBusiness: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `business/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Business'],
        }),
        getMyBusinesses: builder.query({
            query: () => 'business/my-businesses',
            providesTags: ['Business'],
        }),
        getCategories: builder.query({
            query: (activeOnly = true) =>
                `business/getcategories`,
            providesTags: ['Category'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetProfileQuery,
    useCreateBusinessMutation,
    useUpdateBusinessMutation,
    useGetMyBusinessesQuery,
    useGetCategoriesQuery,
} = devanzaApi;