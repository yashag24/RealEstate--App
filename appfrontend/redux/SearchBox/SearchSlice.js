// redux/SearchBox/SearchSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getFilteredPropertiesThunk,
  searchSuggestionsThunk,
} from "./SearchThunk";
import Toast from "react-native-toast-message";

const initialState = {
  expanded: [
    "panel1",
    "panel2",
    "panel3",
    "panel4",
    "panel5",
    "panel6",
    "panel7",
    "panel8",
    "panel9",
  ],
  city: "",
  recentSearchCities: [],
  searchOption: "Buy",
  budgetRange: [0, 2000000000],
  noOfBedrooms: [],
  propertyType: [],
  area: [0, 400000000],
  withPhotos: false,
  reraApproved: false,
  verifiedProperties: false,
  amenities: [],
  availabilityStatus: [],
  postedBy: [],
  furnitureType: [],
  purchaseType: [],
  isSuggestionsLoading: false,
  suggestions: [],
  properties: [],
  isPropertyLoading: false,
};

export const searchSuggestions = createAsyncThunk(
  "search/searchSuggestions",
  async (city, thunkAPI) => {
    return searchSuggestionsThunk("/Search", city, thunkAPI);
  }
);

export const getFilteredProperties = createAsyncThunk(
  "properties/getFilteredProperties",
  async (filters, thunkAPI) => {
    return getFilteredPropertiesThunk(
      "/PostForm/details/Filter",
      filters,
      thunkAPI
    );
  }
);

const SearchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    handleCity: (state, { payload }) => {
      state.city = payload;
      if (payload && typeof payload === "string") {
        const updated = state.recentSearchCities.filter(
          (city) => city !== payload
        );
        updated.unshift(payload);
        state.recentSearchCities = updated.slice(0, 4);
      }
    },
    updateFilters: (state, { payload }) => {
      return { ...state, ...payload };
    },
    handleChange: (state, { payload }) => {
      if (state.expanded.includes(payload)) {
        state.expanded = state.expanded.filter((item) => item !== payload);
      } else {
        state.expanded.push(payload);
      }
    },
    handleSearchOption: (state, { payload }) => {
      state.searchOption = payload;
    },
    handleBudgetRange: (state, { payload }) => {
      state.budgetRange = payload;
    },
    handleNoOfBedrooms: (state, { payload }) => {
      if (payload === null) {
        state.noOfBedrooms = [];
      } else {
        state.noOfBedrooms = [payload];
      }
    },

    handlePropertyType: (state, { payload }) => {
      const exists = state.propertyType.includes(payload);
      state.propertyType = exists
        ? state.propertyType.filter((item) => item !== payload)
        : [...state.propertyType, payload];
    },
    handleArea: (state, { payload }) => {
      state.area = payload;
    },
    handleWithPhotos: (state) => {
      state.withPhotos = !state.withPhotos;
    },
    handleReraApproved: (state) => {
      state.reraApproved = !state.reraApproved;
    },
    handleVerifiedProperties: (state) => {
      state.verifiedProperties = !state.verifiedProperties;
    },
    handleAmenities: (state, { payload }) => {
      const exists = state.amenities.includes(payload);
      state.amenities = exists
        ? state.amenities.filter((item) => item !== payload)
        : [...state.amenities, payload];
    },
    handleAvailabilityStatus: (state, { payload }) => {
      const exists = state.availabilityStatus.includes(payload);
      state.availabilityStatus = exists
        ? state.availabilityStatus.filter((item) => item !== payload)
        : [...state.availabilityStatus, payload];
    },
    handlePostedBy: (state, { payload }) => {
      const exists = state.postedBy.includes(payload);
      state.postedBy = exists
        ? state.postedBy.filter((item) => item !== payload)
        : [...state.postedBy, payload];
    },
    handleFurnitureType: (state, { payload }) => {
      const exists = state.furnitureType.includes(payload);
      state.furnitureType = exists
        ? state.furnitureType.filter((item) => item !== payload)
        : [...state.furnitureType, payload];
    },
    handlePurchaseType: (state, { payload }) => {
      const exists = state.purchaseType.includes(payload);
      state.purchaseType = exists
        ? state.purchaseType.filter((item) => item !== payload)
        : [...state.purchaseType, payload];
    },
    updateSuggestions: (state, { payload }) => {
      state.suggestions = payload;
    },
    updateProperties: (state, { payload }) => {
      state.properties = payload;
    },
    clearSearchState: () => initialState,
    handleSearchCity: (state, { payload }) => {
      if (typeof payload === "string") {
        state.city = { title: payload };
      } else if (payload?.inputValue) {
        state.city = { title: payload.inputValue };
      } else {
        state.city = payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchSuggestions.pending, (state) => {
        state.isSuggestionsLoading = true;
      })
      .addCase(searchSuggestions.fulfilled, (state, { payload }) => {
        state.isSuggestionsLoading = false;
        const suggestMap = new Map();
        for (let item of payload) {
          suggestMap.set(item.address, item.address);
          suggestMap.set(item.city, item.city);
          suggestMap.set(item.state, item.state);
        }
        state.suggestions = Array.from(suggestMap.values()).map((address) => ({
          address,
        }));
      })
      .addCase(searchSuggestions.rejected, (state, { payload }) => {
        state.isSuggestionsLoading = false;
        Toast.show({
          type: "error",
          text1: "Error",
          text2: payload?.message || "Failed to fetch suggestions",
        });
      })
      .addCase(getFilteredProperties.pending, (state) => {
        state.isPropertyLoading = true;
      })
      .addCase(getFilteredProperties.fulfilled, (state, { payload }) => {
        state.isPropertyLoading = false;
        state.properties = payload;
      })
      .addCase(getFilteredProperties.rejected, (state, { payload }) => {
        state.isPropertyLoading = false;
        console.log("Property fetch failed:", payload);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: payload?.message || "Failed to fetch properties",
        });
      });
  },
});

export const {
  handleSearchOption,
  handleBudgetRange,
  handleNoOfBedrooms,
  handlePropertyType,
  handleArea,
  handleWithPhotos,
  handleAmenities,
  handleAvailabilityStatus,
  handleChange,
  clearSearchState,
  handleSearchCity,
  handleReraApproved,
  handleVerifiedProperties,
  handlePostedBy,
  handleFurnitureType,
  handlePurchaseType,
  updateFilters,
  handleCity,
} = SearchSlice.actions;

export default SearchSlice.reducer;
