
import { Route } from "react-router-dom";
import RequestLaptopManagement from "../pages/LaptopRequest/LaptopRequest";

export const ItRoutes = () => (
  <>
    <Route path="/laptop-request" element={<RequestLaptopManagement />} />
  </>
);