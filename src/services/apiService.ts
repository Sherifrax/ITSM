import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiBaseName } from "../enum/api/ApiBaseName.enum";

// Function to get the token (modify as per your auth logic)
const getToken = () => localStorage.getItem("token") || "";

// Create a base API service with token authentication
export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiBaseName.BASE_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}), // Empty endpoints, as specific services will extend this
});
