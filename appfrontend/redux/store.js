import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice'; // Create this slice

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});