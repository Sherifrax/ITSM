import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiBaseName} from "../enum/api/ApiBaseName.enum";
import { ApiLogin } from "../enum/api/ApiLogin.enum";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: ApiBaseName.BASE_URL }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: ApiLogin.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
