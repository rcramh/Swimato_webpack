import {configureStore} from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

const appStore = configureStore({
    reducer : {
        cart : cartReducer,
    },
});
// slices will go inside my store

export default appStore;



