//import React from "react";
import { Route } from "react-router-dom";
import ApiKeyManagement from "../pages/UserManagement/ApiKeyManagement";

export const ApiRoutes = () => (
  <>
    <Route path="/manage-api" element={<ApiKeyManagement />} />
  </>
);