import { apiService } from "../apiService";
import { KeyMappingUrls } from "../../enum/api/KeyMappingUrls";

// Define the connect request payload
interface ConnectKeyMappingRequest {
  apikeyList: string[]; // Updated to match the API
  urlmapping_id: number;
}

// Inject endpoints for connecting API keys
export const keyMappingConnect = apiService.injectEndpoints({
  endpoints: (builder) => ({
    saveKeyMapping: builder.mutation<void, ConnectKeyMappingRequest>({
      query: (requestData) => {
        // Construct the URL with query parameters
        const url = `${KeyMappingUrls.Connect}?apikeyList=${JSON.stringify(
          requestData.apikeyList
        )}&urlmapping_id=${requestData.urlmapping_id}`;

        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*", // Add this header if required by the API
          },
        };
      },
    }),
  }),
});

// Export hooks for use in components
export const { useSaveKeyMappingMutation } = keyMappingConnect;