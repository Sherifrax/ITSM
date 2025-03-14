import { apiService } from "../apiService";
import { UrlMappingUrls } from "../../enum/api/urlMapping.enum";

// Define the save request payload
interface SaveUrlMappingRequest {
  id: number | null;
  incomingurl: string;
  mappedurl: string;
  isactive: boolean;
}

// Inject endpoints for saving URL mappings
export const urlMappingSave = apiService.injectEndpoints({
  endpoints: (builder) => ({
    saveUrlMapping: builder.mutation<void, SaveUrlMappingRequest>({
      query: (urlMappingData) => ({
        url: UrlMappingUrls.Save,
        method: "POST",
        body: urlMappingData,
      }),
    }),
  }),
});

// Export hooks for use in components
export const { useSaveUrlMappingMutation } = urlMappingSave;