import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiBaseName} from "../enum/api/ApiBaseName.enum";
import { ApiLogin } from "../enum/api/ApiLogin.enum";

export const grafanaApi = createApi({
  reducerPath: "grafanaApi",
  baseQuery: fetchBaseQuery({ baseUrl: ApiBaseName.GRAFANA_BASE_URL }),
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => `${ApiLogin.DASHBOARD}`,
    }),
  }),
});

export const { useGetDashboardDataQuery } = grafanaApi;
