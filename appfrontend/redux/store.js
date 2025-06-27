import { configureStore } from "@reduxjs/toolkit";
import SearchSlice from "./SearchBox/SearchSlice";
import SearchModalSlice from "./SearchModal/SearchModalSlice";

export const store = configureStore({
  reducer: {
    search: SearchSlice,
    searchModal: SearchModalSlice,
  },
});
