import { apiService } from "../apiService";
import { ApiKeyUrls } from "../../enum/api/ApiKey.enum";

interface SaveApiKeyRequest {
  apiKey: string | null; // Allow apiKey to be string or null
  clientName: string;
  isActive: boolean;
  isIpCheck: boolean;
  isCountryCheck: boolean;
  isRegionCheck: boolean;
}

export const apiKeySave = apiService.injectEndpoints({
  endpoints: (builder) => ({
    saveApiKey: builder.mutation<void, SaveApiKeyRequest>({
      query: (apiKeyData) => ({
        url: ApiKeyUrls.Save,
        method: "POST",
        body: apiKeyData,
      }),
    }),
  }),
});

export const { useSaveApiKeyMutation } = apiKeySave;
