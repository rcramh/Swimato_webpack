import {configureStore} from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import { apiSlice } from "./apiSlice";

const appStore = configureStore({
    reducer : {
        cart : cartReducer,
        auth : authReducer,
        [apiSlice.reducerPath] : apiSlice.reducer,
    },
    // RTK Query's middleware runs the request lifecycle and cache expiry
    middleware : (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
// slices will go inside my store

export default appStore;
