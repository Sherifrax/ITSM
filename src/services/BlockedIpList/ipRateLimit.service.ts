import { apiService } from "../apiService";
import { IPRateLimitUrls } from "../../enum/api/BlockedIpList.enum";

// Define the search request payload
interface SearchIPRateLimitsRequest {
  ipaddress?: string;
}

// Define the IP rate limit response
export interface IPRateLimit {
  iPaddress: string;
  requestCount: number;
  lastRequestTime: string;
  isblocked: boolean;
}

// Define the save (block/unblock) request payload
interface SaveIPRateLimitRequest {
  iPaddress: string;
  comment: string;
}

// Define the history response
export interface IPRateLimitHistory {
  iPaddress: string;
  requestCount: number;
  lastRequestTime: string;
  isblocked: boolean;
  comment: string;
  updateddate: string;
}

// Inject endpoints for IP rate limits
export const ipRateLimitApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchIPRateLimits: builder.query<IPRateLimit[], SearchIPRateLimitsRequest>({
      query: (params) => ({
        url: IPRateLimitUrls.IPRateSearch,
        method: "GET",
        params,
      }),
    }),
    saveIPRateLimit: builder.mutation<{ result: string }, SaveIPRateLimitRequest>({
      query: (body) => ({
        url: IPRateLimitUrls.Save,
        method: "POST",
        body,
      }),
    }),
    getIPRateLimitHistory: builder.query<IPRateLimitHistory[], { ipaddress: string }>({
      query: (params) => ({
        url: IPRateLimitUrls.HistoryGet,
        method: "GET",
        params,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useSearchIPRateLimitsQuery,
  useSaveIPRateLimitMutation,
  useGetIPRateLimitHistoryQuery,
} = ipRateLimitApi;