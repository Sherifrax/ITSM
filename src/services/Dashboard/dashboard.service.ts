import { apiService } from "../apiService";
import { DashboardUrls } from "../../enum/api/DashboardApiCount.enum";

export interface DashboardApiCount {
  totalApiKey: number;
  totalBlockedIP: number;
  monthlyAPIhit: number;
  dailyAPIhit: number;
  monthlyAvgHit: number;
}

export const dashboardApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardApiCount: builder.query<DashboardApiCount[], void>({
      query: () => ({
        url: DashboardUrls.DashboardApiCount,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardApiCountQuery } = dashboardApi;