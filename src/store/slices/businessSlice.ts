import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Business, Category } from '../../types/business';

interface BusinessState {
    businesses: Business[];
    categories: Category[];
    selectedBusinessId: number | null;
}

const initialState: BusinessState = {
    businesses: [],
    categories: [],
    selectedBusinessId: null,
};

const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        setBusinesses: (state, action: PayloadAction<Business[]>) => {
            state.businesses = action.payload;
        },
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        selectBusiness: (state, action: PayloadAction<number>) => {
            state.selectedBusinessId = action.payload;
        },
        clearBusinessData: (state) => {
            state.businesses = [];
            state.categories = [];
            state.selectedBusinessId = null;
        },
    },
});

export const { setBusinesses, setCategories, selectBusiness, clearBusinessData } = businessSlice.actions;
export default businessSlice.reducer;