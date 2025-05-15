import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { ReactNode } from "react";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Login from "./pages/LoginPage/Login";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useGetDashboardDataQuery } from "./services/grafanaApi";
import { ApprovalReq, ItRoutes } from "./router/routes";
import Home from "./pages/Dashboard";

// Enhanced authentication check with token validation
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  // Check token expiration
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Component to verify authentication before rendering children
const AuthVerifier = ({ children }: { children: ReactNode }) => {
  const { error } = useGetDashboardDataQuery({}); // Using any API query to check auth
  
  if (error && 'status' in error && error.status === 401) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Private Route Wrapper
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <AuthVerifier>{children}</AuthVerifier>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route index path="/home" element={<Home/>} />
              {ItRoutes()}
              {ApprovalReq()}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;