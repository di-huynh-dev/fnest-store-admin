import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authSlice from './src/features/authSlice';
import roomSlice from './src/features/roomSlice';
import categorySlice from './src/features/categorySlice';
import collectionSlice from './src/features/collectionSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};
const rootReducer = combineReducers({
    auth: authSlice,
    room: roomSlice,
    collection: collectionSlice,
    category: categorySlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export let persistor = persistStore(store);
