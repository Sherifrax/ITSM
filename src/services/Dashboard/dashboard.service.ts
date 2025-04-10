import { apiService } from "../apiService";
import { DashboardUrls } from "../../enum/api/DashboardUrls.enum";

export interface DashboardApiCount {
  totalApiKey: number;
  totalBlockedIP: number;
  todayAPIhit: number;
  totalAvgAPIhit: number;
  last7daysHit: number;
  last30daysHit: number;
  last1yearHit: number;
}

export interface DailyHit {
  requestDate: string;
  hitCount: number;
}

export interface MonthStatusHit {
  monthYear: string;
  statusCode: number;
  status: string;
  hitCount: number;
}

export const dashboardApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardApiCount: builder.query<DashboardApiCount[], void>({
      query: () => ({
        url: DashboardUrls.DashboardApiCount,
        method: "GET",
      }),
    }),
    getDailyHit: builder.query<DailyHit[], void>({
      query: () => ({
        url: DashboardUrls.GetDailyHit,
        method: "GET",
      }),
    }),
    getMonthStatusHit: builder.query<MonthStatusHit[], void>({
      query: () => ({
        url: DashboardUrls.GetMonthStatusHit,
        method: "GET",
      }),
    }),
  }),
});

export const { 
  useGetDashboardApiCountQuery,
  useGetDailyHitQuery,
  useGetMonthStatusHitQuery 
} = dashboardApi;