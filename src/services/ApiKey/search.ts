import { apiService } from "../apiService";
import { ApiKeyUrls } from "../../enum/api/ApiKey.enum";

interface ApiKey {
  apiKey: string;
  clientName: string;
  isActive: boolean;
  isIpCheck: boolean;
  isCountryCheck: boolean;
  isRegionCheck: boolean;
}

interface SearchParams {
  clientName?: string;
  isActive?: number;
  isIpCheck?: number;
  isCountryCheck?: number;
  isRegionCheck?: number;
}

export const apiKeySearch = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchApiKeys: builder.query<ApiKey[], SearchParams>({
      query: ({ clientName = "", isActive = -1, isIpCheck = -1, isCountryCheck = -1, isRegionCheck = -1 }) => ({
        url: ApiKeyUrls.Search,
        method: "GET",
        params: { clientName, isActive, isIpCheck, isCountryCheck, isRegionCheck }, // Use params instead of query string
      }),
    }),
  }),
});

export const { useSearchApiKeysQuery } = apiKeySearch;
