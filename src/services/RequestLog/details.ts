import { apiService } from "../apiService";
import { RequestLogUrls } from "../../enum/api/requestLog.enum";

// Define the details request payload
interface GetRequestLogDetailsRequest {
  requestlogid: string; // Updated to match the API
}

// Define the detailed request log response
export interface RequestLogDetails {
  detailid: string;
  requestlogid: string;
  requesturl: string;
  requestdata: string;
  responsestatuscode: string | null;
  responsemessage: string | null;
  responsedata: string | null;
  createdat: string;
  updatedat: string;
  requestparams: string | null;
}

// Inject endpoints for getting request log details
export const requestLogDetails = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getRequestLogDetails: builder.query<RequestLogDetails, GetRequestLogDetailsRequest>({
      query: (params) => ({
        url: RequestLogUrls.DetailsGet,
        method: "GET",
        params, // Pass requestlogid as a query parameter
      }),
    }),
  }),
});

// Export hooks for use in components
export const { useGetRequestLogDetailsQuery } = requestLogDetails;