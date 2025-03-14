import { apiService } from "../apiService";
import { KeyMappingUrls } from "../../enum/api/KeyMappingUrls";

interface ApiKey {
  apikey: string;
  clientname: string;
}

// Define the search parameters for API keys
interface SearchParams {
  urlmapping_id: number;
}

// Inject endpoints for searching API keys
export const keyMappingSearch = apiService.injectEndpoints({
  endpoints: (builder) => ({
    fetchApiKeys: builder.query<ApiKey[], SearchParams>({
      query: ({ urlmapping_id }) => ({
        url: KeyMappingUrls.Search,
        method: "GET",
        params: { urlmapping_id }, // Use params instead of query string
      }),
    }),
  }),
});


// Export hooks for use in components
export const { useFetchApiKeysQuery } = keyMappingSearch;
