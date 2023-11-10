import { createSlice } from '@reduxjs/toolkit';
const categorySlice = createSlice({
    name: 'category',
    initialState: {
        category: {
            currentCategory: null,
            error: false,
        },
    },
    reducers: {
        getAllCategorysSuccess: (state, action) => {
            state.category.currentCategory = action.payload;
            state.category.error = false;
        },
        addCategorySuccess: (state, action) => {
            state.category.currentCategory = action.payload;
            state.category.error = false;
        },
        updateCategorySuccess: (state, action) => {
            state.category.currentCategory = action.payload;
            state.category.error = false;
        },
        deleteCategorySuccess: (state, action) => {
            state.category.currentCategory = action.payload;
            state.category.error = false;
        },
    },
});

export const { getAllCategorysSuccess, addCategorySuccess, updateCategorySuccess, deleteCategorySuccess } =
    categorySlice.actions;

export default categorySlice.reducer;
