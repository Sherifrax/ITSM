import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { grafanaApi } from "../services/grafanaApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [grafanaApi.reducerPath]: grafanaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        authApi.middleware, 
        grafanaApi.middleware
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
