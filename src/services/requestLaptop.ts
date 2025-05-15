// src/services/requestLaptop.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RequestLaptopUrls, RequestLaptop, CreateRequestPayload } from '../types/requestLaptop';

export const requestLaptopApi = createApi({
  reducerPath: 'requestLaptopApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://10.20.20.54:8080/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      // Remove Content-Type header for FormData - it will be set automatically
      return headers;
    }
  }),
  endpoints: (builder) => ({
    createLaptopRequest: builder.mutation<RequestLaptop, FormData>({
      query: (formData) => ({
        url: RequestLaptopUrls.START,
        method: 'POST',
        body: formData,
      }),
    }),
    getRequestsByCreator: builder.query<RequestLaptop[], string>({
      query: (empNumber) => `${RequestLaptopUrls.GET_BY_CREATED_BY}/${empNumber}`,
    }),
    getRequestsByRecipient: builder.query<RequestLaptop[], string>({
      query: (empNumber) => `${RequestLaptopUrls.GET_BY_CREATED_FOR}/${empNumber}`,
    }),
    getAssignedRequests: builder.query<RequestLaptop[], string>({
      query: (empNumber) => `${RequestLaptopUrls.GET_ASSIGNED_TO}/${empNumber}`,
    }),
    completeTask: builder.mutation({
      query: ({ taskId, ...body }) => ({
        url: `mr/api/process/${taskId}/complete`,
        method: 'POST',
        body,
      }),
    }),
    updateRequestStatus: builder.mutation({
      query: ({ ticketNo, ...body }) => ({
        url: `mr/api/process/update-status/${ticketNo}`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useCreateLaptopRequestMutation,
  useGetRequestsByCreatorQuery,
  useGetRequestsByRecipientQuery,
  useGetAssignedRequestsQuery,
  useCompleteTaskMutation,
  useUpdateRequestStatusMutation
} = requestLaptopApi;