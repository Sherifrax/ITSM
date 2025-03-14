//import React from "react";
import { Route } from "react-router-dom";
import ApiKeyManagement from "../pages/UserManagement/ApiKeyManagement";

export const UserRoutes = () => (
  <>
    <Route path="/manage-users" element={<ApiKeyManagement />} />
  </>
);