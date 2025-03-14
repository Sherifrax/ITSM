import { apiService } from "../apiService";
import { UrlMappingUrls } from "../../enum/api/urlMapping.enum";
import { UrlMapping } from "../../types/UrlMapping";

// Define the search parameters for URL mappings
interface SearchParams {
  incomingurl?: string;
  mappedurl?: string;
  isactive?: number;
}

// Inject endpoints for searching URL mappings
export const urlMappingSearch = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchUrlMappings: builder.query<UrlMapping[], SearchParams>({
      query: ({ incomingurl = "", mappedurl = "", isactive = -1 }) => ({
        url: UrlMappingUrls.Search,
        method: "GET",
        params: { incomingurl, mappedurl, isactive }, // Use params instead of query string
      }),
    }),
  }),
});

export const { useSearchUrlMappingsQuery } = urlMappingSearch;
