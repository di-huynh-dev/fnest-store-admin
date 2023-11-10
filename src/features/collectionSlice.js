import { createSlice } from '@reduxjs/toolkit';

const collectionSlice = createSlice({
    name: 'collection',
    initialState: {
        collection: {
            currentCollection: null,
            error: false,
        },
    },
    reducers: {
        getAllCollectionsSuccess: (state, action) => {
            state.collection.currentCollection = action.payload;
            state.collection.error = false;
        },
        addCollectionSuccess: (state, action) => {
            state.collection.currentCollection = action.payload;
            state.collection.error = false;
        },
        updateCollectionSuccess: (state, action) => {
            state.collection.currentCollection = action.payload;
            state.collection.error = false;
        },
        deleteCollectionSuccess: (state, action) => {
            state.collection.currentCollection = action.payload;
            state.collection.error = false;
        },
    },
});

export const { getAllCollectionsSuccess, addCollectionSuccess, updateCollectionSuccess, deleteCollectionSuccess } =
    collectionSlice.actions;

export default collectionSlice.reducer;
