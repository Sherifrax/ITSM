
import { Route } from "react-router-dom";
import RequestLaptopManagement from "../pages/ItRequest/LaptopRequest";
import ApprovalPage from "../pages/Approvals/ApprovalRequests";

export const ItRoutes = () => (
  <>
    <Route path="/laptop-request" element={<RequestLaptopManagement />} />
  </>
);


export const ApprovalReq = () => (
  <>
    <Route path="/approval-request" element={<ApprovalPage />} />
  </>
)