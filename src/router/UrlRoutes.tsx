//import React from "react";
import { Route } from "react-router-dom";
import UrlMapping from "../pages/UrlMapping/UrlMapping";

export const UrlRoutes = () => (
  <>
    <Route path="/url-mapping" element={<UrlMapping />} />
  </>
);