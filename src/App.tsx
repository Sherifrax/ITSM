import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/LoginPage/Login";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ApiKeyManagement from "./pages/UserManagement/ApiKeyManagement";
import UrlMapping from "./pages/UrlMapping/UrlMapping";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            {/* Tables */}
            <Route path="/manage-users" element={<ApiKeyManagement />} />
            <Route path="/url-mapping" element={<UrlMapping />} />
          </Route>
          {/* Auth Layout */}
          <Route path="/login" element={<Login />} />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}
export default App;
