//import React from "react";
import { Route } from "react-router-dom";
import NotFound from "../pages/OtherPage/NotFound";

export const RequestLog = () => (
  <>
    <Route path="/requestlog" element={<NotFound />} />
  </>
);