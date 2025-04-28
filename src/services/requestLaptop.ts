// src/services/requestLaptop.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const requestLaptopApi = createApi({
  reducerPath: 'requestLaptopApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://10.20.20.54:8080/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  endpoints: (builder) => ({
    // Submit new laptop request
    createLaptopRequest: builder.mutation({
      query: (payload) => ({
        url: 'mr/api/process/start',
        method: 'POST',
        body: payload
      }),
    }),
    // Get requests by creator
    getRequestsByCreator: builder.query({
      query: (empNumber) => `mr/api/process/created-by/${empNumber}`,
    }),
    // Get requests by recipient
    getRequestsByRecipient: builder.query({
      query: (empNumber) => `mr/api/process/created-for/${empNumber}`,
    }),
  }),
});

export const { 
  useCreateLaptopRequestMutation,
  useGetRequestsByCreatorQuery,
  useGetRequestsByRecipientQuery 
} = requestLaptopApi;