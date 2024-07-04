import { configureStore } from "@reduxjs/toolkit";
import userData from "./userDataSlice";
import ApiSlice from "./ApiSlice";
export let store = configureStore({
    reducer: {
        userData,
        ApiSlice
    }
})