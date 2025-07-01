import { configureStore } from "@reduxjs/toolkit";
import SearchSlice from "./SearchBox/SearchSlice";
import SearchModalSlice from "./SearchModal/SearchModalSlice";
import authReducer from './Auth/AuthSlice';

export const store = configureStore({
  reducer: {
    search: SearchSlice,
    searchModal: SearchModalSlice,
    auth: authReducer,
  },
});
