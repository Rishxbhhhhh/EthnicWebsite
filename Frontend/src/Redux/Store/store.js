import { configureStore } from '@reduxjs/toolkit';
import collectionsReducer from './slices/collectionSlice';
import adminReducer from "./slices/adminSlice"

const store = configureStore({
  reducer: {
    collections: collectionsReducer,
    admin: adminReducer,
  },
});

export default store;