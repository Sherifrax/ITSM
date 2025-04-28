import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { grafanaApi } from "../services/grafanaApi";
import { apiService } from "../services/apiService"; // Import the apiService
import { requestLaptopApi } from '../services/requestLaptop';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [grafanaApi.reducerPath]: grafanaApi.reducer,
    [apiService.reducerPath]: apiService.reducer, // Add apiService reducer,
    [requestLaptopApi.reducerPath]: requestLaptopApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        authApi.middleware,
        grafanaApi.middleware,
        apiService.middleware, // Add apiService middleware
        requestLaptopApi.middleware,

    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
