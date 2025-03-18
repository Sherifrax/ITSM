//import React from "react";
import { Route } from "react-router-dom";
import RequestLogManagement from "../pages/RequestLog/RequestLog";

export const RequestLog = () => (
  <>
    <Route path="/requestlog" element={<RequestLogManagement />} />
  </>
);